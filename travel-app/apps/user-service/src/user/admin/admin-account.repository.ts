import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

export interface AdminAccountFilter {
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class AdminAccountRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}


async findAccounts(
  filter: AdminAccountFilter = {},
) {
  console.log('🔥🔥🔥 REPOSITORY RECEIVED FILTER:', filter);
  console.log(
    '🔥🔥🔥 REPOSITORY RECEIVED PAGE:',
    filter?.page,
  );
  console.log(
    '🔥🔥🔥 REPOSITORY RECEIVED LIMIT:',
    filter?.limit,
  );

  const page = Math.max(
    filter.page ?? 1,
    1,
  );

  const limit = Math.min(
    Math.max(filter.limit ?? 10, 1),
    50,
  );

  const skip = (page - 1) * limit;

  console.log(
    '🔥🔥🔥 CALCULATED:',
    {
      page,
      limit,
      skip,
    },
  );
}
}