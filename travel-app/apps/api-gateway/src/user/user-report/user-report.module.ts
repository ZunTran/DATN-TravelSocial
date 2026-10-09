import { Module } from '@nestjs/common';
import { UserReportResolver } from './user-report.resolver';
import { UserReportService } from './user-report.service';
import { UserGraphqlClient } from '../clients/user-graphql-client';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
  ],

  providers: [
    UserGraphqlClient,
    UserReportResolver,
    UserReportService,
  ],

  exports: [
    UserReportService,
  ],
})
export class UserReportModule {}