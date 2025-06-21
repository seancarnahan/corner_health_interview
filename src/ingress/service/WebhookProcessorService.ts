import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { WebhookEventDto } from '../domain/dto/WebhookEventDto';
import { WebhookEvent } from '../domain/interface/WebhookEvent';

@Injectable()
export class WebhookProcessorService implements OnModuleInit {
  private readonly logger = new Logger(WebhookProcessorService.name);
  private webhookEvents: WebhookEvent[] = [];

  constructor(
    @Inject('WEBHOOK_EVENTS') private readonly injectedEvents: WebhookEvent[],
  ) {}

  onModuleInit() {
    this.webhookEvents = this.injectedEvents;
  }

  async process(dto: WebhookEventDto): Promise<void> {
    this.logger.log(`Processing webhook event: ${dto.eventType}`);

    const handler = this.webhookEvents.find((event) => event.validate(dto));

    if (!handler) {
      this.logger.warn(`No handler found for event type: ${dto.eventType}`);
      throw new Error(`Unsupported webhook event type: ${dto.eventType}`);
    }

    await handler.process(dto);
    this.logger.log(`Successfully processed webhook event: ${dto.eventType}`);
  }
}
