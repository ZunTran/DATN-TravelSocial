import { Module } from '@nestjs/common';
import { TravelPlanResolver } from './travel-plan.resolver';
import { TravelPlanService } from './travel-plan.service';
import { TravelPlanRepository } from './travel-plan.repository';
import { UserProfileClient } from '../../common/clients/user-profile/user-profile.client';

@Module({
  providers: [
    TravelPlanResolver,
    TravelPlanService,
    TravelPlanRepository,
    UserProfileClient,
  ],
  exports: [
    TravelPlanService,
    TravelPlanRepository,
  ],
})
export class TravelPlanModule {}