import { Module } from '@nestjs/common';

import { AiGraphqlClient } from './ai-graphql.client';

@Module({
  providers: [
    AiGraphqlClient,
  ],

  exports: [
    AiGraphqlClient,
  ],
})
export class AiClientModule {}