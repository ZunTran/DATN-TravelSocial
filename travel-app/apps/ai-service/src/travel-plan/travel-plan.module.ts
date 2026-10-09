import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { HttpModule } from "@nestjs/axios";
import { TravelPlanService } from "./travel-plan.service";
import { TravelPlanResolver } from "./travel-plan.resolver";
import { TravelPlanRepository } from "./travel-plan.repository";
import { TravelPlanQueryService } from "./travel-plan-query.service";
import { SocialLocationClient } from "../social/social-location.client";
import { SocialModule } from "../social/social.module";
import { LlmModule } from "../llm/llm.module";
import { TravelPlanItemModule } from "../ai/travel-plan-item/travel-plan-item.module";
import { UserProfileClientModule } from "../common/clients/user-profile/user-profile.module";

@Module({
  imports: [
    PrismaModule,
    SocialModule,
    HttpModule,
    LlmModule,
    TravelPlanItemModule,
    UserProfileClientModule
  ],

  providers: [
    TravelPlanResolver,
    TravelPlanService,
    TravelPlanRepository,
    TravelPlanQueryService,
    SocialLocationClient,
  ],

  exports: [
    TravelPlanService,
    TravelPlanQueryService
  ],
})
export class TravelPlanModule {}