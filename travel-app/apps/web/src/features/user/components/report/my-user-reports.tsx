'use client';

import { useState } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Button,
} from '@/components/ui/button';

import {
  Separator,
} from '@/components/ui/separator';

import { UserReportStatusBadge } from './user-report-status-badge';
import { useMyUserReports } from '../../user-report/hooks/use-my-user-reports';



function formatDate(
  value?: string | null,
) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleString(
    'vi-VN',
  );
}

interface MyUserReportsProps {
  limit?: number;
}

export function MyUserReports({
  limit = 10,
}: MyUserReportsProps) {
  const [page, setPage] = useState(1);

  const {
    reports,
    pagination,
    loading,
    error,
  } = useMyUserReports(
    page,
    limit,
  );

  const canPrevious =
    pagination.page > 1;

  const canNext =
    pagination.page <
    pagination.totalPages;

  if (loading && reports.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Đang tải báo cáo...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-destructive">
        Không thể tải danh sách báo cáo.
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Bạn chưa gửi báo cáo nào.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base">
                  Báo cáo người dùng
                </CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  {report.reported_user
                    ? `@${report.reported_user.username}`
                    : report.reported_user_id}
                </p>
              </div>

              <UserReportStatusBadge
                status={report.status}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="mb-1 text-sm font-medium">
                Lý do
              </p>

              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {report.reason}
              </p>
            </div>

            <Separator />

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">
                  Ngày gửi
                </p>

                <p>
                  {formatDate(
                    report.created_at,
                  )}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Ngày xử lý
                </p>

                <p>
                  {formatDate(
                    report.handled_at,
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Trang {pagination.page} /{' '}
            {pagination.totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={
                !canPrevious ||
                loading
              }
              onClick={() =>
                setPage((value) =>
                  Math.max(1, value - 1),
                )
              }
            >
              Trước
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={
                !canNext ||
                loading
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
    </div>
  );
}