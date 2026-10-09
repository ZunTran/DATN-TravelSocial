import { Prisma } from '@prisma/client';

const travelPlanSelect =
  Prisma.validator<Prisma.travel_planSelect>()({
    id: true,
    user_id: true,
    title: true,
    destination: true,
    input: true,
    content: true,
    status: true,
    created_at: true,
    updated_at: true,

    items: {
      select: {
        id: true,
        travel_plan_id: true,
        day_index: true,
        time_slot: true,
        activity_name: true,
        location_id: true,
        description: true,
        cost_estimate: true,
      },
      orderBy: [
        { day_index: 'asc' },
        { time_slot: 'asc' },
      ],
    },
  });

export type TravelPlanRecord =
  Prisma.travel_planGetPayload<{
    select: typeof travelPlanSelect;
  }>;