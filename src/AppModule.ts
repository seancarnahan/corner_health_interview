import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IngressModule } from './ingress/IngressModule';
import { InsuranceModule } from './insurance/InsuranceModule';
import { AppointmentCreatedWebhookEvent } from './insurance/domain/event/AppointmentCreatedWebhookEvent';
import { HealthieModule } from './healthie/HealthieModule';
import { EligibilityModule } from './eligibility/EligibilityModule';
import { AdminModule } from './admin/AdminModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    IngressModule.register({
      webhookEvents: [AppointmentCreatedWebhookEvent],
      imports: [InsuranceModule],
    }),
    InsuranceModule,
    HealthieModule,
    EligibilityModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
