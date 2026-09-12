'use client';

import {
  Users,
  UserPlus,
  Activity,
  Ban,
  Lock,
  Monitor,
} from 'lucide-react';

import AdminStatCard from '@/features/admin/components/admin-stat-card';

import type {
  AdminUserDashboard,
} from '../types/admin-dashboard.types';

interface Props {
  dashboard: AdminUserDashboard;
}

export function AdminDashboardStats({
  dashboard,
}: Props) {
  const { users, sessions } = dashboard;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      <AdminStatCard
        title="Tổng người dùng"
        value={users.total.toLocaleString()}
        icon={Users}
      />

      <AdminStatCard
        title="Người dùng mới"
        value={users.newUsers.toLocaleString()}
        icon={UserPlus}
      />

      <AdminStatCard
        title="Tài khoản hoạt động"
        value={users.active.toLocaleString()}
        icon={Activity}
      />

      <AdminStatCard
        title="Bị cấm"
        value={users.banned.toLocaleString()}
        icon={Ban}
      />

      <AdminStatCard
        title="Bị khóa"
        value={users.locked.toLocaleString()}
        icon={Lock}
      />

      <AdminStatCard
        title="Phiên hoạt động"
        value={sessions.activeSessions.toLocaleString()}
        icon={Monitor}
      />
    </div>
  );
}