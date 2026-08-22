import { Module } from '@nestjs/common';
import { TravelPlanItemResolver } from './travel-plan-item.resolver';
import { TravelPlanItemService } from './travel-plan-item.service';
import { TravelPlanItemRepository } from './travel-plan-item.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { UserProfileClient } from '../../common/clients/user-profile/user-profile.client';
import { HttpModule } from '@nestjs/axios';

@Module({
         imports: [
    HttpModule,
  ],
  providers: [
    PrismaService,
    UserProfileClient,

    TravelPlanItemRepository,
    TravelPlanItemService,
    TravelPlanItemResolver,
  ],

  exports: [
    TravelPlanItemService,
    TravelPlanItemRepository,
  ],
})
export class TravelPlanItemModule {}