import { ObjectType, Field, Query, Resolver } from '@nestjs/graphql';
import { HealthService } from './health.service';

@ObjectType()
class GatewayHealthObject {
  @Field()
  status: string;

  @Field()
  service: string;
}

@Resolver(() => GatewayHealthObject)
export class HealthResolver {
  constructor(
    private readonly healthService: HealthService,
  ) {}

  @Query(() => GatewayHealthObject)
  health() {
    return this.healthService.check();
  }
}