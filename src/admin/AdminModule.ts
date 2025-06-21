import { Module } from '@nestjs/common';
import { AdminController } from './api/v1/route/AdminController';
import { AdminService } from './service/AdminService';
import { HealthieModule } from '../healthie/HealthieModule';

@Module({
  imports: [HealthieModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
