import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { HealthModule } from './health/health.module';
import { GatewayResolver } from './app/graphql/gateway.resolver';
import { UserGatewayModule } from './user/user.gateway.module';
import { AuthGatewayModule } from './auth/auth.gateway.module';
import { Request, Response } from 'express';
import { AdminModule } from './admin/admin.module';
import { SocialModule } from './social/social.gateway.module';
import { TravelPlanModule } from './travel-plan/travel-plan.module';
import { UserReportModule } from './user/user-report/user-report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    HttpModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,

      playground: true,
      introspection: true,

      context: ({
        req,
        res,
      }: {
        req: Request;
        res: Response;
      }) => ({ req, res}),
    }),

    HealthModule,
    AuthGatewayModule,
    UserGatewayModule,
    SocialModule,
    AdminModule,
    TravelPlanModule,
    
  ],

  providers: [
    GatewayResolver,
  ],
})
export class AppModule {}