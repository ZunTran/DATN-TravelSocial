'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Button,
} from '@/components/ui/button';
import { UserReport } from '../../user-report/types/user-report.types';
import { UserReportStatusBadge } from './user-report-status-badge';



interface AdminUserReportTableProps {
  reports: UserReport[];

  loading?: boolean;

  onSelectReport: (
    reportId: string,
  ) => void;
}

function formatDate(
  value: string,
) {
  return new Date(value).toLocaleString(
    'vi-VN',
  );
}

export function AdminUserReportTable({
  reports,
  loading = false,
  onSelectReport,
}: AdminUserReportTableProps) {
  if (loading && reports.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        Đang tải báo cáo...
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="rounded-md border py-10 text-center text-muted-foreground">
        Không có báo cáo nào.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              Người báo cáo
            </TableHead>

            <TableHead>
              Người bị báo cáo
            </TableHead>

            <TableHead>
              Lý do
            </TableHead>

            <TableHead>
              Trạng thái
            </TableHead>

            <TableHead>
              Ngày gửi
            </TableHead>

            <TableHead className="text-right">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {report.reporter
                      ?.display_name ??
                      report.reporter
                        ?.username ??
                      report.reporter_id}
                  </p>

                  {report.reporter && (
                    <p className="text-xs text-muted-foreground">
                      @{report.reporter.username}
                    </p>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div>
                  <p className="font-medium">
                    {report.reported_user
                      ?.display_name ??
                      report.reported_user
                        ?.username ??
                      report.reported_user_id}
                  </p>

                  {report.reported_user && (
                    <p className="text-xs text-muted-foreground">
                      @{report.reported_user.username}
                    </p>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <p className="max-w-[280px] truncate">
                  {report.reason}
                </p>
              </TableCell>

              <TableCell>
                <UserReportStatusBadge
                  status={report.status}
                />
              </TableCell>

              <TableCell>
                {formatDate(
                  report.created_at,
                )}
              </TableCell>

              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onSelectReport(
                      report.id,
                    )
                  }
                >
                  Xem
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}