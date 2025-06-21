import { Test, TestingModule } from '@nestjs/testing';
import { InsuranceEligibilityProcessor } from './InsuranceEligibilityProcessor';
import { HealthieService } from '../../healthie/service/HealthieService';
import { EligibilityClient } from '../../eligibility/api/v1/client/EligibilityClient';
import { HealthieChatService } from '../../healthie/service/HealthieChatService';
import { HealthieAppointmentDetails } from '../../healthie/domain/models/HealthieAppointmentDetails';

describe(InsuranceEligibilityProcessor.name, () => {
  let processor: InsuranceEligibilityProcessor;
  let healthieService: jest.Mocked<HealthieService>;
  let eligibilityClient: jest.Mocked<EligibilityClient>;
  let healthieChatService: jest.Mocked<HealthieChatService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsuranceEligibilityProcessor,
        {
          provide: HealthieService,
          useValue: {
            getAppointmentWithPatientAndInsurance: jest.fn(),
          },
        },
        {
          provide: EligibilityClient,
          useValue: {
            checkEligibility: jest.fn(),
          },
        },
        {
          provide: HealthieChatService,
          useValue: {
            sendMessageToProvider: jest.fn(),
          },
        },
      ],
    }).compile();

    processor = module.get<InsuranceEligibilityProcessor>(
      InsuranceEligibilityProcessor,
    );
    healthieService = module.get(HealthieService);
    eligibilityClient = module.get(EligibilityClient);
    healthieChatService = module.get(HealthieChatService);
  });

  describe(InsuranceEligibilityProcessor.prototype.process.name, () => {
    const appointmentId = 'appointment-123';
    const providerId = 'provider-456';

    it('should send N/A status when no insurance policies exist', async () => {
      const appointmentDetails: HealthieAppointmentDetails = {
        appointment: {
          id: appointmentId,
          date: '2024-01-01',
          contactType: 'in_person',
          location: 'Main Clinic',
          provider: { id: providerId, fullName: 'Dr. John Smith' },
        },
        insurance: {
          policies: [],
        },
        patient: {
          id: 'patient-789',
          fullName: 'Jane Doe',
          firstName: 'Jane',
          dob: '1990-01-01',
        },
      } as unknown as HealthieAppointmentDetails;

      healthieService.getAppointmentWithPatientAndInsurance.mockResolvedValue(
        appointmentDetails,
      );

      await processor.process(appointmentId);

      expect(
        healthieService.getAppointmentWithPatientAndInsurance,
      ).toHaveBeenCalledWith(appointmentId);
      expect(healthieChatService.sendMessageToProvider).toHaveBeenCalledWith(
        providerId,
        expect.stringContaining('❌ No insurance information on file'),
      );
      expect(eligibilityClient.checkEligibility).not.toHaveBeenCalled();
    });

    it('should check eligibility and send result when insurance policy exists', async () => {
      const appointmentDetails: HealthieAppointmentDetails = {
        appointment: {
          id: appointmentId,
          date: '2024-01-01',
          contactType: 'in_person',
          location: 'Main Clinic',
          provider: { id: providerId, fullName: 'Dr. John Smith' },
        },
        insurance: {
          policies: [
            {
              num: 'POLICY123',
              insurancePlan: {
                payerId: 'PAYER001',
                payerName: 'Blue Cross',
              },
            },
          ],
        },
        patient: {
          id: 'patient-789',
          fullName: 'Jane Doe',
          firstName: 'Jane',
          dob: '1990-01-01',
        },
      } as unknown as HealthieAppointmentDetails;

      healthieService.getAppointmentWithPatientAndInsurance.mockResolvedValue(
        appointmentDetails,
      );
      eligibilityClient.checkEligibility.mockResolvedValue(true);

      await processor.process(appointmentId);

      expect(
        healthieService.getAppointmentWithPatientAndInsurance,
      ).toHaveBeenCalledWith(appointmentId);
      expect(eligibilityClient.checkEligibility).toHaveBeenCalledWith(
        'PAYER001',
        'POLICY123',
        '1990-01-01',
      );
      expect(healthieChatService.sendMessageToProvider).toHaveBeenCalledWith(
        providerId,
        expect.stringContaining('✅ Insurance verified and active'),
      );
    });

    it('should handle eligibility check errors gracefully', async () => {
      const appointmentDetails: HealthieAppointmentDetails = {
        appointment: {
          id: appointmentId,
          date: '2024-01-01',
          contactType: 'in_person',
          location: 'Main Clinic',
          provider: { id: providerId, fullName: 'Dr. John Smith' },
        },
        insurance: {
          policies: [
            {
              num: 'POLICY123',
              insurancePlan: {
                payerId: 'PAYER001',
                payerName: 'Blue Cross',
              },
            },
          ],
        },
        patient: {
          id: 'patient-789',
          fullName: 'Jane Doe',
          firstName: 'Jane',
          dob: '1990-01-01',
        },
      } as unknown as HealthieAppointmentDetails;

      healthieService.getAppointmentWithPatientAndInsurance.mockResolvedValue(
        appointmentDetails,
      );
      eligibilityClient.checkEligibility.mockRejectedValue(
        new Error('Eligibility check failed'),
      );

      await processor.process(appointmentId);

      expect(
        healthieService.getAppointmentWithPatientAndInsurance,
      ).toHaveBeenCalledWith(appointmentId);
      expect(eligibilityClient.checkEligibility).toHaveBeenCalledWith(
        'PAYER001',
        'POLICY123',
        '1990-01-01',
      );
      expect(healthieChatService.sendMessageToProvider).not.toHaveBeenCalled();
    });
  });
});
