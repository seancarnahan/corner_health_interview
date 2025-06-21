import { Injectable, Logger } from '@nestjs/common';
import { WebhookEvent } from '../../../ingress/domain/interface/WebhookEvent';
import { WebhookEventDto } from '../../../ingress/domain/dto/WebhookEventDto';
import { InsuranceEligibilityProcessor } from '../../service/InsuranceEligibilityProcessor';

@Injectable()
export class AppointmentCreatedWebhookEvent implements WebhookEvent {
  private readonly logger = new Logger(AppointmentCreatedWebhookEvent.name);

  constructor(
    private readonly insuranceEligibilityProcessor: InsuranceEligibilityProcessor,
  ) {}

  eventType = 'appointment.created';

  validate(dto: WebhookEventDto): boolean {
    return (
      dto.eventType === this.eventType && dto.resourceIdType === 'Appointment'
    );
  }

  async process(dto: WebhookEventDto): Promise<void> {
    this.logger.log(
      `Processing appointment created webhook for appointment ID: ${dto.resourceId}`,
    );

    await this.insuranceEligibilityProcessor.process(dto.resourceId);
  }
}
