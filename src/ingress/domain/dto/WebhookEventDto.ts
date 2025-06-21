import { Expose } from 'class-transformer';

export class WebhookEventDto {
  @Expose()
  resourceId: string;

  @Expose()
  resourceIdType: string;

  @Expose()
  eventType: string;
}
