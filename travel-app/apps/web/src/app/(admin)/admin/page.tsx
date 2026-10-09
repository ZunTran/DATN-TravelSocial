'use client';
import { useState } from 'react';
import { AdminDashboardStats } from '@/features/admin/dashboard/components/admin-dashboard-stats';
import { UserRegistrationChart } from '@/features/admin/dashboard/components/user-registration-chart';
import { SessionActivityChart } from '@/features/admin/dashboard/components/session-activity-chart';
import { useAdminDashboard } from '@/features/admin/dashboard/hooks/use-admin-dashboard';
import type { DashboardDays } from '@/features/admin/dashboard/types/admin-dashboard.types';
import { AdminAccountTable } from '@/features/admin/account/components/admin-account-table';

const DAY_OPTIONS: {
  value: DashboardDays;
  label: string;  }[] = [
  {
    value: 7,
    label: '7 ngày',
  },
  {
    value: 30,
    label: '30 ngày',
  },
  {
    value: 90,
    label: '90 ngày',
  },
  {
    value: null,
    label: 'Từ trước tới nay',
  },
];

export default function AdminDashboard() {
  const [days, setDays] =
    useState<DashboardDays>(30);

  const {
    dashboard,
    loading,
    error,
  } = useAdminDashboard({
    days,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Dashboard
          </h1>

          <p className="text-muted-foreground">
            Tổng quan hệ thống Travel Social
          </p>
        </div>

        <select
          value={
            days === null
              ? 'all'
              : days
          }
          onChange={(event) => {
            const value =
              event.target.value;

            setDays(
              value === 'all'
                ? null
                : (Number(
                    value,
                  ) as DashboardDays),
            );
          }}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value={7}>  7 ngày</option>
          <option value={30}> 30 ngày</option>
          <option value={90}> 90 ngày</option>
          <option value="all"> Từ trước tới nay</option>
        </select>
      </div>


      {error && !dashboard && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6 text-sm text-destructive">
          Không thể tải dữ liệu dashboard.
        </div>
      )}


      {loading && !dashboard && (
        <DashboardSkeleton />
      )}


      {dashboard && (
        <>
          <AdminDashboardStats
            dashboard={dashboard}
          />

          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Registration growth
                </h2>

                <p className="text-sm text-muted-foreground">
                  So sánh số user đăng ký với kỳ trước
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold">
                  {dashboard
                    .registrationGrowth
                    .percentage > 0
                    ? '+'
                    : ''}

                  {
                    dashboard
                      .registrationGrowth
                      .percentage
                  }
                  %
                </p>

                <p className="text-sm text-muted-foreground">
                  {getTrendLabel(
                    dashboard
                      .registrationGrowth
                      .trend,
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <UserRegistrationChart
              data={
                dashboard.userGrowthByDay
              }
            />

            <SessionActivityChart
              data={
                dashboard.sessionActivityByDay
              }
            />
          </div>

          <AdminAccountTable />

        </>
      )}
    </div>
  );
}

function getTrendLabel(
  trend:
    | 'UP'
    | 'DOWN'
    | 'STABLE',
) {
  switch (trend) {
    case 'UP':
      return 'Tăng so với kỳ trước';

    case 'DOWN':
      return 'Giảm so với kỳ trước';

    default:
      return 'Không thay đổi';
  }
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-xl border bg-muted/40"
          />
        ))}
      </div>

      <div className="h-28 animate-pulse rounded-xl border bg-muted/40" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[390px] animate-pulse rounded-xl border bg-muted/40" />

        <div className="h-[390px] animate-pulse rounded-xl border bg-muted/40" />
      </div>
    </div>
  );
}