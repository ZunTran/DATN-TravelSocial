'use client';

import { AdminLocationManagement } from '@/features/admin/location/components/admin-location-management';

export default function AdminLocationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Quản lý địa điểm
        </h1>

        <p className="text-muted-foreground">
          Quản lý các địa điểm được sử dụng khi tạo bài viết.
        </p>
      </div>

      <AdminLocationManagement />
    </div>
  );
}