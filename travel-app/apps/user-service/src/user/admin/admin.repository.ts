import { Injectable } from '@nestjs/common';
import { account_role, account_status, user_privacy, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAccountByEmail(email: string) {
    return this.prisma.account.findUnique({
      where: { email },
    });
  }

  async createAdminWithProfile(
    email: string,
    passwordHash: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const newAccount = await tx.account.create({
        data: {
          email,
          password_hash: passwordHash,
          role: account_role.ADMIN,
          status: account_status.ACTIVE,
          email_verified: true,
          tokenVersion: 0,
        },
      });

      const newProfile =
        await tx.user_profile.create({
          data: {
            account_id: newAccount.id,
            username: `admin_${Date.now()}`,
            display_name: 'System Administrator',
            privacy: user_privacy.PUBLIC,
          },
        });

      return {
        newAccount,
        newProfile,
      };
    });
  }

async getUserStatistics(
  startDate?: Date,
  endDate?: Date,
) {
  const dateFilter =
    startDate && endDate
      ? {
          created_at: {
            gte: startDate,
            lt: endDate,
          },
        }
      : {};

  const [
    total,
    newUsers,
    active,
    banned,
    locked,
  ] = await Promise.all([
    this.prisma.account.count({
      where: {
        role: account_role.USER,
      },
    }),

    this.prisma.account.count({
      where: {
        role: account_role.USER,
        ...dateFilter,
      },
    }),

    this.prisma.account.count({
      where: {
        role: account_role.USER,
        status: account_status.ACTIVE,
      },
    }),

    this.prisma.account.count({
      where: {
        role: account_role.USER,
        status: account_status.BANNED,
      },
    }),

    this.prisma.account.count({
      where: {
        role: account_role.USER,
        status: account_status.LOCKED,
      },
    }),
  ]);

  return {
    total,
    newUsers,
    active,
    banned,
    locked,
  };
}

async getUserGrowth(
  startDate?: Date,
  endDate?: Date,
) {
  if (!startDate || !endDate) {
    const result =
      await this.prisma.$queryRaw<
        {
          date: Date;
          count: bigint;
        }[]
      >`
        SELECT
          DATE(created_at) AS date,
          COUNT(*) AS count
        FROM account
        WHERE role = 'USER'
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at);
      `;

    return result.map((item) => ({
      date: item.date,
      count: Number(item.count),
    }));
  }

  const result =
    await this.prisma.$queryRaw<
      {
        date: Date;
        count: bigint;
      }[]
    >`
      SELECT
        d.date::date AS date,
        COALESCE(u.count, 0) AS count
      FROM generate_series(
        ${startDate}::date,
        (${endDate}::date - INTERVAL '1 day'),
        INTERVAL '1 day'
      ) AS d(date)

      LEFT JOIN (
        SELECT
          DATE(created_at) AS date,
          COUNT(*) AS count
        FROM account
        WHERE
          role = 'USER'
          AND created_at >= ${startDate}
          AND created_at < ${endDate}
        GROUP BY DATE(created_at)
      ) u
      ON u.date = d.date

      ORDER BY d.date;
    `;

  return result.map((item) => ({
    date: item.date,
    count: Number(item.count),
  }));
}


  async getPreviousPeriodUserCount( startDate: Date, endDate: Date) {
    return this.prisma.account.count({
      where: {
        role: account_role.USER,
        created_at: {
          gte: startDate,
          lt: endDate,
        },
      },
    });
  }

async getSessionStatistics(
  startDate?: Date,
  endDate?: Date,
) {
  const dateFilter =
    startDate && endDate
      ? {
          last_active_at: {
            gte: startDate,
            lt: endDate,
          },
        }
      : {};

  const [
    sessions,
    activeSessions,
  ] = await Promise.all([
    this.prisma.login_session.count({
      where: dateFilter,
    }),

    this.prisma.login_session.count({
      where: {
        is_active: true,
        ...dateFilter,
      },
    }),
  ]);

  const uniqueUsersResult =
    await this.prisma.$queryRaw<
      { count: bigint }[]
    >`
      SELECT COUNT(DISTINCT account_id) AS count
      FROM login_session
      ${
        startDate && endDate
          ? Prisma.sql`
              WHERE last_active_at >= ${startDate}
              AND last_active_at < ${endDate}
            `
          : Prisma.empty
      }
    `;

  const activeUsers = Number(
    uniqueUsersResult[0]?.count ?? 0,
  );

  return {
    sessions,
    uniqueUsers: activeUsers,
    activeSessions,
  };
}

async getSessionActivity(
  startDate?: Date,
  endDate?: Date,
) {

  if (!startDate || !endDate) {
    const result =
      await this.prisma.$queryRaw<
        {
          date: Date;
          sessions: bigint;
          users: bigint;
        }[]
      >`
        SELECT
          DATE(last_active_at) AS date,
          COUNT(*) AS sessions,
          COUNT(DISTINCT account_id) AS users
        FROM login_session
        GROUP BY DATE(last_active_at)
        ORDER BY DATE(last_active_at);
      `;

return result.map((item) => ({
  date: item.date,
  sessions: Number(item.sessions),
  users: Number(item.users),
}));
  }

  const result =
    await this.prisma.$queryRaw<
      {
        date: Date;
        sessions: bigint;
        users: bigint;
      }[]
    >`
      SELECT
        d.date::date AS date,
        COALESCE(s.sessions, 0) AS sessions,
        COALESCE(s.users, 0) AS users

      FROM generate_series(
        ${startDate}::date,
        (${endDate}::date - INTERVAL '1 day'),
        INTERVAL '1 day'
      ) AS d(date)

      LEFT JOIN (
        SELECT
          DATE(last_active_at) AS date,
          COUNT(*) AS sessions,
          COUNT(DISTINCT account_id) AS users
        FROM login_session
        WHERE
          last_active_at >= ${startDate}
          AND last_active_at < ${endDate}
        GROUP BY DATE(last_active_at)
      ) s
      ON s.date = d.date

      ORDER BY d.date;
    `;

  return result.map((item) => ({
    date: item.date,
    sessions: Number(item.sessions),
    users: Number(item.users),
  }));
}

async getUserGrowthAll() {
  const result = await this.prisma.$queryRaw<
    {
      date: Date;
      count: bigint;
    }[]
  >`
    SELECT
      DATE(created_at) AS date,
      COUNT(*) AS count
    FROM account
    WHERE role = 'USER'
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at);
  `;

  return result.map((item) => ({
    date: item.date,
    count: Number(item.count),
  }));
}

async getSessionActivityAll() {
  const result = await this.prisma.$queryRaw<
    {
      date: Date;
      sessions: bigint;
      users: bigint;
    }[]
  >`
    SELECT
      DATE(last_active_at) AS date,
      COUNT(*) AS sessions,
      COUNT(DISTINCT account_id) AS users
    FROM login_session
    GROUP BY DATE(last_active_at)
    ORDER BY DATE(last_active_at);
  `;

  return result.map((item) => ({
    date: item.date,
    sessions: Number(item.sessions),
    users: Number(item.users),
  }));
}

}