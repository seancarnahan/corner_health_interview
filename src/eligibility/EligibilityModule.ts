import { Module } from '@nestjs/common';
import { EligibilityController } from './api/v1/route/EligibilityController';
import { EligibilityService } from './service/EligibilityService';
import { EligibilityClient } from './api/v1/client/EligibilityClient';

@Module({
  imports: [],
  controllers: [EligibilityController],
  providers: [EligibilityService, EligibilityClient],
  exports: [EligibilityClient],
})
export class EligibilityModule {}
