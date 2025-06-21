import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { WebhookEventDto } from '../../../domain/dto/WebhookEventDto';

export class WebhookRequest {
  @ApiProperty({ name: 'resource_id' })
  @Expose({ name: 'resource_id' })
  @IsString()
  @IsNotEmpty()
  resourceId: string;

  @ApiProperty({ name: 'resource_id_type', example: 'Appointment' })
  @Expose({ name: 'resource_id_type' })
  @IsString()
  @IsNotEmpty()
  resourceIdType: string;

  @ApiProperty({ name: 'event_type', example: 'appointment.created' })
  @Expose({ name: 'event_type' })
  @IsString()
  @IsNotEmpty()
  eventType: string;

  static toDto(request: WebhookRequest): WebhookEventDto {
    return plainToInstance(WebhookEventDto, {
      resourceId: request.resourceId,
      resourceIdType: request.resourceIdType,
      eventType: request.eventType,
    });
  }
}
