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

//   async findAccounts(
//     filter: AdminAccountFilter = {},
//   ) {
//     const page = Math.max(
//       filter.page ?? 1,
//       1,
//     );

//     const limit = Math.min(
//       Math.max(filter.limit ?? 10, 1),
//       50,
//     );

//     const skip = (page - 1) * limit;

//     const search = filter.search?.trim() ?? '';

//     const searchCondition = search
//       ? Prisma.sql`
//           AND (
//             a.email ILIKE ${`%${search}%`}
//             OR p.username ILIKE ${`%${search}%`}
//             OR p.display_name ILIKE ${`%${search}%`}
//           )
//         `
//       : Prisma.empty;

//     const [items, countResult] =
//       await Promise.all([
//         this.prisma.$queryRaw<
//           {
//             id: string;
//             email: string;
//             username: string | null;
//             display_name: string | null;
//             status: string;
//             last_login_at: Date | null;
//             created_at: Date;
//           }[]
//         >`
//           SELECT
//             a.id,
//             a.email,
//             p.username,
//             p.display_name,
//             a.status::text AS status,
//             MAX(ls.last_active_at) AS last_login_at,
//             a.created_at
//           FROM account a

//           LEFT JOIN user_profile p
//             ON p.account_id = a.id

//           LEFT JOIN login_session ls
//             ON ls.account_id = a.id

//           WHERE a.role = 'USER'
//           ${searchCondition}

//           GROUP BY
//             a.id,
//             a.email,
//             p.username,
//             p.display_name,
//             a.status,
//             a.created_at

//           ORDER BY
//             MAX(ls.last_active_at) DESC NULLS LAST,
//             a.created_at DESC

//           LIMIT ${limit}
//           OFFSET ${skip};
//         `,

//         this.prisma.$queryRaw<
//           { count: bigint }[]
//         >`
//           SELECT COUNT(*) AS count
//           FROM account a

//           LEFT JOIN user_profile p
//             ON p.account_id = a.id

//           WHERE a.role = 'USER'
//           ${searchCondition};
//         `,
//       ]);

//     const total = Number(
//       countResult[0]?.count ?? 0,
//     );

//     return {
//       items: items.map((item) => ({
//         id: item.id,
//         email: item.email,
//         username: item.username,
//         displayName: item.display_name,
//         status: item.status,
//         lastLoginAt: item.last_login_at,
//         createdAt: item.created_at,
//       })),

//       total,
//       page,
//       limit,
//       totalPages:
//         total === 0
//           ? 0
//           : Math.ceil(total / limit),
//     };
//   }


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