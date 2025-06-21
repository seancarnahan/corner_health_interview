import { WebhookEventDto } from '../dto/WebhookEventDto';

export interface WebhookEvent {
  eventType: string;
  validate(dto: WebhookEventDto): boolean;
  process(dto: WebhookEventDto): Promise<void>;
}
