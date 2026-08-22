import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '../common/auth/strategies/jwt.strategy';

import { UserProfileClientModule } from '../common/clients/user-profile/user-profile.module';

import { TravelPlanModule } from './travel-plan/travel-plan.module';
import { TravelPlanItemModule } from './travel-plan-item/travel-plan-item.module';
import { RecommendationModule } from './recommendation/recommendation.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    UserProfileClientModule,

    TravelPlanModule,
    TravelPlanItemModule,
    RecommendationModule,
  ],

  providers: [
    JwtStrategy,
  ],
})
export class AiModule {}