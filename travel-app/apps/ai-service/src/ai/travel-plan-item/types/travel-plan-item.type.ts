import { Prisma } from '@prisma/client';

export type TravelPlanItemRecord =
  Prisma.travel_plan_itemGetPayload<{
    select: {
      id: true;
      travel_plan_id: true;
      day_index: true;
      time_slot: true;
      activity_name: true;
      location_id: true;
      description: true;
      cost_estimate: true;
    };
  }>;