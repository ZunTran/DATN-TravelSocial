import { Module } from '@nestjs/common';

import { AiClientModule } from '../common/clients/ai/ai-client.module';
import { TravelPlanGatewayResolver } from './travel-plan.resolver';
import { TravelPlanGatewayService } from './travel-plan.service';



@Module({
  imports: [
    AiClientModule,
  ],

  providers: [
    TravelPlanGatewayResolver,
    TravelPlanGatewayService,
  ],

  exports: [
    TravelPlanGatewayService,
  ],
})
export class TravelPlanModule {}