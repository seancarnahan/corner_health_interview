import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebhookRequest } from '../request/WebhookRequest';
import { WebhookProcessorService } from '../../../service/WebhookProcessorService';

@ApiTags('webhooks')
@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly webhookProcessorService: WebhookProcessorService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle webhook events' })
  @ApiResponse({
    status: 200,
    description: 'Webhook received successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid webhook payload',
  })
  handleWebhook(@Body() webhookRequest: WebhookRequest): void {
    const dto = WebhookRequest.toDto(webhookRequest);

    this.webhookProcessorService.process(dto).catch((error) => {
      this.logger.error(`Failed to process webhook: ${JSON.stringify(error)}`);
    });
  }
}
