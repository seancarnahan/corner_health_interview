import { Injectable, Logger } from '@nestjs/common';
import { HealthieAppointmentDetails } from '../../healthie/domain/models/HealthieAppointmentDetails';
import { HealthieService } from '../../healthie/service/HealthieService';
import { EligibilityClient } from '../../eligibility/api/v1/client/EligibilityClient';
import { HealthieChatService } from '../../healthie/service/HealthieChatService';
import { createInsuranceEligibilityMessage } from '../domain/helpers/createInsuranceEligibilityMessage';

@Injectable()
export class InsuranceEligibilityProcessor {
  private readonly logger = new Logger(InsuranceEligibilityProcessor.name);

  constructor(
    private readonly healthieService: HealthieService,
    private readonly eligibilityClient: EligibilityClient,
    private readonly healthieChatService: HealthieChatService,
  ) {}

  async process(appointmentId: string): Promise<void> {
    const { appointment, insurance, patient }: HealthieAppointmentDetails =
      await this.healthieService.getAppointmentWithPatientAndInsurance(
        appointmentId,
      );
    const providerId = appointment.provider.id;

    if (!insurance.policies || insurance.policies.length === 0) {
      const message = createInsuranceEligibilityMessage({
        eligibilityStatus: 'N/A',
        patient,
        provider: appointment.provider,
        appointment,
      });

      await this.healthieChatService.sendMessageToProvider(providerId, message);
      return;
    }

    const policy = insurance.policies[0];

    try {
      const eligibilityResult = await this.eligibilityClient.checkEligibility(
        policy.insurancePlan.payerId,
        policy.num,
        patient.dob,
      );

      const message = createInsuranceEligibilityMessage({
        eligibilityStatus: eligibilityResult,
        patient,
        provider: appointment.provider,
        appointment,
        policy,
      });

      await this.healthieChatService.sendMessageToProvider(providerId, message);
    } catch (error) {
      this.logger.error('Error fetching eligibiliy result', error);
    }
  }
}
