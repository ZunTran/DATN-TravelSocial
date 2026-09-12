import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { AdminRepository } from './admin.repository';
import { AdminAccountRepository } from './admin-account.repository';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
      private readonly adminAccountRepository: AdminAccountRepository,

  ) {}

  async seedDefaultAdmin() {
    const email = 'admin@travelsocial.com';
    const rawPassword = 'AdminPassword123@';

    const existing =
      await this.adminRepository.findAccountByEmail(
        email,
      );

    if (existing) {
      throw new ConflictException(
        'Tài khoản Admin đã tồn tại trong hệ thống!',
      );
    }

    const passwordHash = await bcrypt.hash(
      rawPassword,
      10,
    );

    const result =
      await this.adminRepository.createAdminWithProfile(
        email,
        passwordHash,
      );

    return {
      message:
        'Khởi tạo tài khoản Admin thành công!',
      email: result.newAccount.email,
      username: result.newProfile.username,
    };
  }

  async getUserDashboard(days: number | null) {
    // =========================
    // VALIDATE DAYS
    // =========================
    if (
      days !== null &&
      ![7, 30, 90].includes(days)
    ) {
      throw new BadRequestException(
        'days phải là 7, 30 hoặc 90',
      );
    }

    const now = new Date();

    // =========================
    // ALL TIME
    // =========================
    if (days === null) {
      const [
        statistics,
        growthByDay,
        sessions,
        sessionActivityByDay,
      ] = await Promise.all([
        this.adminRepository.getUserStatistics(),

        this.adminRepository.getUserGrowthAll(),

        this.adminRepository.getSessionStatistics(),

        this.adminRepository.getSessionActivityAll(),
      ]);

      return {
        users: statistics,

        sessions: {
          sessions: sessions.sessions,
          uniqueUsers: sessions.uniqueUsers,
          activeSessions: sessions.activeSessions,
        },

        registrationGrowth: {
          percentage: 0,
          trend: 'STABLE',
        },

        userGrowthByDay: growthByDay,

        sessionActivityByDay:
          sessionActivityByDay,
      };
    }

    // =========================
    // LIMITED PERIOD
    // =========================
    const currentStart = new Date(now);

    currentStart.setDate(
      currentStart.getDate() - days,
    );

    const previousEnd = new Date(
      currentStart,
    );

    const previousStart = new Date(
      currentStart,
    );

    previousStart.setDate(
      previousStart.getDate() - days,
    );

    const [
      statistics,
      growthByDay,
      previousUsers,
      sessions,
      sessionActivityByDay,
    ] = await Promise.all([
      this.adminRepository.getUserStatistics(
        currentStart,
        now,
      ),

      this.adminRepository.getUserGrowth(
        currentStart,
        now,
      ),

      this.adminRepository.getPreviousPeriodUserCount(
        previousStart,
        previousEnd,
      ),

      this.adminRepository.getSessionStatistics(
        currentStart,
        now,
      ),

      this.adminRepository.getSessionActivity(
        currentStart,
        now,
      ),
    ]);

    const currentUsers =
      statistics.newUsers;

    const growthPercentage =
      this.calculateGrowth(
        currentUsers,
        previousUsers,
      );

    const trend =
      growthPercentage > 0
        ? 'UP'
        : growthPercentage < 0
          ? 'DOWN'
          : 'STABLE';

    return {
      users: statistics,

      sessions: {
        sessions: sessions.sessions,
        uniqueUsers: sessions.uniqueUsers,
        activeSessions:
          sessions.activeSessions,
      },

      registrationGrowth: {
        percentage: Number(
          growthPercentage.toFixed(2),
        ),
        trend,
      },

      userGrowthByDay: growthByDay,

      sessionActivityByDay:
        sessionActivityByDay,
    };
  }

  private calculateGrowth(
    current: number,
    previous: number,
  ) {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return (
      ((current - previous) / previous) *
      100
    );
  }

//   async getAdminAccounts(
//   filter: {
//     search?: string;
//     page?: number;
//     limit?: number;
//   } = {},
// ) {
//   return this.adminAccountRepository.findAccounts(
//     filter,
//   );
// }

async getAdminAccounts(
  filter: {
    search?: string;
    page?: number;
    limit?: number;
  } = {},
) {
  console.log(
    '🔥 [USER SERVICE] filter:',
    JSON.stringify(filter, null, 2),
  );

  console.log(
    '🔥 [USER SERVICE] page:',
    filter.page,
  );

  return this.adminAccountRepository.findAccounts(
    filter,
  );
}
}