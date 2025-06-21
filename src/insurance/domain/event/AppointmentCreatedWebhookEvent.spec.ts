import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentCreatedWebhookEvent } from './AppointmentCreatedWebhookEvent';
import { WebhookEventDto } from '../../../ingress/domain/dto/WebhookEventDto';
import { InsuranceEligibilityProcessor } from '../../service/InsuranceEligibilityProcessor';

const dto: WebhookEventDto = {
  resourceId: 'appointment-123',
  resourceIdType: 'Appointment',
  eventType: 'appointment.created',
};

describe(AppointmentCreatedWebhookEvent.name, () => {
  let webhookEvent: AppointmentCreatedWebhookEvent;
  let mockInsuranceEligibilityProcessor: jest.Mocked<InsuranceEligibilityProcessor>;

  beforeEach(async () => {
    const mockProcessor = {
      process: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentCreatedWebhookEvent,
        {
          provide: InsuranceEligibilityProcessor,
          useValue: mockProcessor,
        },
      ],
    }).compile();

    webhookEvent = module.get<AppointmentCreatedWebhookEvent>(
      AppointmentCreatedWebhookEvent,
    );
    mockInsuranceEligibilityProcessor = module.get(
      InsuranceEligibilityProcessor,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(AppointmentCreatedWebhookEvent.prototype.validate.name, () => {
    it('should validate appointment.created event with Appointment resource type', () => {
      const result = webhookEvent.validate(dto);

      expect(result).toBe(true);
    });

    it('should reject wrong event type', () => {
      const dto: WebhookEventDto = {
        resourceId: 'appointment-123',
        resourceIdType: 'Appointment',
        eventType: 'appointment.updated',
      };

      const result = webhookEvent.validate(dto);

      expect(result).toBe(false);
    });

    it('should reject wrong resource type', () => {
      const dto: WebhookEventDto = {
        resourceId: 'patient-123',
        resourceIdType: 'Patient',
        eventType: 'appointment.created',
      };

      const result = webhookEvent.validate(dto);

      expect(result).toBe(false);
    });

    it('should reject both wrong event type and resource type', () => {
      const dto: WebhookEventDto = {
        resourceId: 'patient-123',
        resourceIdType: 'Patient',
        eventType: 'patient.created',
      };

      const result = webhookEvent.validate(dto);

      expect(result).toBe(false);
    });
  });

  describe(AppointmentCreatedWebhookEvent.prototype.process.name, () => {
    it('should process appointment created webhook successfully', async () => {
      const dto: WebhookEventDto = {
        resourceId: 'appointment-456',
        resourceIdType: 'Appointment',
        eventType: 'appointment.created',
      };

      await webhookEvent.process(dto);

      expect(mockInsuranceEligibilityProcessor.process).toHaveBeenCalledTimes(
        1,
      );
      expect(mockInsuranceEligibilityProcessor.process).toHaveBeenCalledWith(
        'appointment-456',
      );
    });
  });
});
