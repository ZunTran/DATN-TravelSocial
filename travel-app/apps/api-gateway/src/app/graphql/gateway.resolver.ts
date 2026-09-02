import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class GatewayResolver {
  @Query(() => String)
  health(): string {
    return 'API Gateway is running';
  }
}