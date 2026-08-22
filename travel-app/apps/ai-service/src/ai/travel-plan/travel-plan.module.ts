import { Module } from '@nestjs/common';
import { TravelPlanResolver } from './travel-plan.resolver';
import { TravelPlanService } from './travel-plan.service';
import { TravelPlanRepository } from './travel-plan.repository';
import { UserProfileClient } from '../../common/clients/user-profile/user-profile.client';
import { TravelPlanItemRepository } from '../travel-plan-item/travel-plan-item.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
     imports: [
    HttpModule,
  ],
  providers: [
    TravelPlanResolver,
    TravelPlanService,
    TravelPlanRepository,
    UserProfileClient,
    TravelPlanItemRepository,
  ],
  exports: [
    TravelPlanService,
    TravelPlanRepository,
  ],
})
export class TravelPlanModule {}