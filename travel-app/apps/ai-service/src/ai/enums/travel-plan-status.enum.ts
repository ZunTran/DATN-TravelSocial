import { registerEnumType } from '@nestjs/graphql';
import { TravelPlanStatus } from '@prisma/client';

registerEnumType(TravelPlanStatus, {
  name: 'TravelPlanStatus',
});

export { TravelPlanStatus };