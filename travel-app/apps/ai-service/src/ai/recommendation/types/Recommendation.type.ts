import {Prisma} from '@prisma/client';


const recommendationLogSelect =
  Prisma.validator<Prisma.recommendation_logSelect>()({
    id: true,
    user_id: true,
    type: true,
    reference_id: true,
    score: true,
    created_at: true,
  });

export type RecommendationLogRecord =
  Prisma.recommendation_logGetPayload<{
    select: typeof recommendationLogSelect;
  }>;