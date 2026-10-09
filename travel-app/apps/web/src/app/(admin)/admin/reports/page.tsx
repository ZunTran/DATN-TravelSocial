'use client';

import { useState } from 'react';

import { UserReportStatus } from '@/features/user/user-report/types/user-report.types';
import { useAdminUserReports } from '@/features/user/user-report/hooks/use-admin-user-reports';
import { AdminUserReportFilter } from '@/features/user/components/report/admin-user-report-filter';
import { AdminUserReportTable } from '@/features/user/components/report/admin-user-report-table';
import { AdminUserReportDetail } from '@/features/user/components/report/admin-user-report-detail';
import { Button } from '@/components/ui/button';

export default function AdminReportsPage() {
  const [page, setPage] = useState(1);

  const [status, setStatus] =
    useState<UserReportStatus | undefined>(
      undefined,
    );

  const [selectedReportId, setSelectedReportId] =
    useState<string | undefined>(
      undefined,
    );

  const [detailOpen, setDetailOpen] =
    useState(false);

  const {
    reports,
    pagination,
    loading,
    error,
    refetch,
  } = useAdminUserReports({
    page,
    limit: 10,
    status,
  });

  const handleStatusChange = (
    nextStatus?: UserReportStatus,
  ) => {
    setStatus(nextStatus);
    setPage(1);
  };

  const handleSelectReport = (
    reportId: string,
  ) => {
    setSelectedReportId(reportId);
    setDetailOpen(true);
  };

  const handleUpdated = async () => {
    await refetch();
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Báo cáo người dùng
        </h1>

        <p className="text-sm text-muted-foreground">
          Quản lý các báo cáo từ người dùng.
        </p>
      </div>

      <AdminUserReportFilter
        status={status}
        onStatusChange={
          handleStatusChange
        }
      />

      {error && (
        <div className="rounded-md border border-destructive p-4 text-sm text-destructive">
          Không thể tải danh sách báo cáo.
        </div>
      )}

      <AdminUserReportTable
        reports={reports}
        loading={loading}
        onSelectReport={
          handleSelectReport
        }
      />

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Trang {pagination.page} /{' '}
            {pagination.totalPages}
            {' · '}
            {pagination.total} báo cáo
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={
                loading ||
                pagination.page <= 1
              }
              onClick={() =>
                setPage((value) =>
                  Math.max(
                    1,
                    value - 1,
                  ),
                )
              }
            >
              Trước
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={
                loading ||
                pagination.page >=
                  pagination.totalPages
              }
              onClick={() =>
                setPage((value) =>
                  value + 1,
                )
              }
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      <AdminUserReportDetail
        reportId={
          selectedReportId
        }
        open={detailOpen}
        onOpenChange={
          setDetailOpen
        }
        onUpdated={
          handleUpdated
        }
      />
    </div>
  );
}