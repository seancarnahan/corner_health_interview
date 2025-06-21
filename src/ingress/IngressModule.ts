import { Module, DynamicModule, Type, ModuleMetadata } from '@nestjs/common';
import { WebhookController } from './api/v1/route/WebhookController';
import { WebhookProcessorService } from './service/WebhookProcessorService';
import { WebhookEvent } from './domain/interface/WebhookEvent';

interface IngressModuleOptions {
  webhookEvents: Type<WebhookEvent>[];
  imports?: ModuleMetadata['imports'];
}

@Module({})
export class IngressModule {
  static register(options: IngressModuleOptions): DynamicModule {
    return {
      module: IngressModule,
      imports: options.imports,
      controllers: [WebhookController],
      providers: [
        WebhookProcessorService,
        ...options.webhookEvents,
        {
          provide: 'WEBHOOK_EVENTS',
          useFactory: (...events: WebhookEvent[]) => events,
          inject: options.webhookEvents,
        },
      ],
      exports: [WebhookProcessorService],
    };
  }
}
