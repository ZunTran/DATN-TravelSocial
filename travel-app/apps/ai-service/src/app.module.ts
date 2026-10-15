import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AiModule } from './ai/ai.module';
import { SocialModule } from './social/social.module';
import { TravelPlanModule } from './travel-plan/travel-plan.module';
import { LlmModule } from './llm/llm.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: true,
      introspection: true,
      csrfPrevention: true,
    }),
    SocialModule,
    AiModule,
    LlmModule,
    TravelPlanModule
  ],
})
export class AppModule {}