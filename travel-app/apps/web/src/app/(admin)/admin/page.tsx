import {
  Users,
  FileText,
  MapPin,
  Flag,
} from "lucide-react";

import AdminStatCard from
  "@/features/admin/components/admin-stat-card";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Tổng quan hệ thống Travel Social
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Users"
          value="0"
          icon={Users}
        />

        <AdminStatCard
          title="Posts"
          value="0"
          icon={FileText}
        />

        <AdminStatCard
          title="Locations"
          value="0"
          icon={MapPin}
        />

        <AdminStatCard
          title="Pending Reports"
          value="0"
          icon={Flag}
        />
      </div>
    </div>
  );
}