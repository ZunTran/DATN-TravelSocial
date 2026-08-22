import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { UserProfileClientModule } from "../../common/clients/user-profile/user-profile.module";
import { RecommendationLogResolver } from "./recommendation.resolver";
import { RecommendationLogService } from "./recommendation.service";
import { RecommendationLogRepository } from "./recommendation.repository";

@Module({
  imports: [
    PrismaModule,
    UserProfileClientModule,
  ],
  providers: [
    RecommendationLogResolver,
    RecommendationLogService,
    RecommendationLogRepository,
  ],
  exports: [
    RecommendationLogService,
  ],
})
export class RecommendationModule {}