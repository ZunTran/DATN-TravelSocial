import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { UserReportResolver } from './user-report.resolver';
import { UserReportService } from './user-report.service';
import { UserReportRepository } from './user-report.repository';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    PrismaModule, 
    UserProfileModule,
    NotificationModule
],
  providers: [
    UserReportResolver, 
    UserReportService, 
    UserReportRepository],
  exports: [
    UserReportService, 
    UserReportRepository],
})
export class UserReportModule {}