import { Module } from '@nestjs/common';
import { InsuranceEligibilityProcessor } from './service/InsuranceEligibilityProcessor';
import { AppointmentCreatedWebhookEvent } from './domain/event/AppointmentCreatedWebhookEvent';
import { HealthieModule } from '../healthie/HealthieModule';
import { EligibilityModule } from '../eligibility/EligibilityModule';

@Module({
  imports: [HealthieModule, EligibilityModule],
  controllers: [],
  providers: [InsuranceEligibilityProcessor, AppointmentCreatedWebhookEvent],
  exports: [InsuranceEligibilityProcessor],
})
export class InsuranceModule {}
