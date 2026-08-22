import { registerEnumType } from '@nestjs/graphql';
import { RecommendationType } from '@prisma/client';

registerEnumType(RecommendationType, {
  name: 'RecommendationType',
});

export { RecommendationType };