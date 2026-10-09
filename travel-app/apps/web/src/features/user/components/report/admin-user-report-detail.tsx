'use client';

import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Button,
} from '@/components/ui/button';

import {
  Separator,
} from '@/components/ui/separator';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  UserReportStatusBadge,
} from './user-report-status-badge';
import { UserReportStatus } from '../../user-report/types/user-report.types';
import { useAdminUserReport } from '../../user-report/hooks/use-admin-user-report';
import { useUpdateUserReportStatus } from '../../user-report/hooks/use-update-user-report-status';


interface AdminUserReportDetailProps {
  reportId?: string;
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;

  onUpdated?: () => void;
}

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

function getAvailableStatuses(
  status: UserReportStatus,
): UserReportStatus[] {
  switch (status) {
    case 'PENDING':
      return [
        'PENDING',
        'REVIEWING',
        'RESOLVED',
        'REJECTED',
      ];

    case 'REVIEWING':
      return [
        'REVIEWING',
        'RESOLVED',
        'REJECTED',
      ];

    case 'RESOLVED':
      return ['RESOLVED'];

    case 'REJECTED':
      return ['REJECTED'];

    default:
      return [];
  }
}

function getStatusLabel(
  status: UserReportStatus,
) {
  switch (status) {
    case 'PENDING':
      return 'Chờ xử lý';

    case 'REVIEWING':
      return 'Đang xem xét';

    case 'RESOLVED':
      return 'Đã xử lý';

    case 'REJECTED':
      return 'Từ chối';
  }
}

export function AdminUserReportDetail({
  reportId,
  open,
  onOpenChange,
  onUpdated,
}: AdminUserReportDetailProps) {
  const {
    report,
    loading,
    error,
    refetch,
  } = useAdminUserReport(
    reportId,
  );

  const {
    updateUserReportStatus,
    loading: updating,
    error: updateError,
  } = useUpdateUserReportStatus();

  const [selectedStatus, setSelectedStatus] =
    useState<
      UserReportStatus | undefined
    >(undefined);

  useEffect(() => {
    if (report) {
      setSelectedStatus(
        report.status,
      );
    }
  }, [report]);

  const handleUpdate = async () => {
    if (
      !report ||
      !selectedStatus ||
      selectedStatus === report.status
    ) {
      return;
    }

    try {
      const updated =
        await updateUserReportStatus(
          report.id,
          selectedStatus,
        );

      if (updated) {
        await refetch();
        onUpdated?.();
      }
    } catch {

    }
  };

  const availableStatuses = report
    ? getAvailableStatuses(
        report.status,
      )
    : [];

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>
            Chi tiết báo cáo
          </DialogTitle>

          <DialogDescription>
            Xem thông tin và cập nhật trạng thái
            báo cáo.
          </DialogDescription>
        </DialogHeader>

        {loading && !report && (
          <div className="py-10 text-center text-muted-foreground">
            Đang tải...
          </div>
        )}

        {error && (
          <div className="py-6 text-center text-destructive">
            Không thể tải báo cáo.
          </div>
        )}

        {report && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Người báo cáo
                </p>

                <p className="font-medium">
                  {report.reporter
                    ?.display_name ??
                    report.reporter?.username ??
                    report.reporter_id}
                </p>

                {report.reporter && (
                  <p className="text-sm text-muted-foreground">
                    @{report.reporter.username}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Người bị báo cáo
                </p>

                <p className="font-medium">
                  {report.reported_user
                    ?.display_name ??
                    report.reported_user
                      ?.username ??
                    report.reported_user_id}
                </p>

                {report.reported_user && (
                  <p className="text-sm text-muted-foreground">
                    @
                    {
                      report.reported_user
                        .username
                    }
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <p className="mb-2 text-sm text-muted-foreground">
                Lý do báo cáo
              </p>

              <div className="rounded-md border bg-muted/30 p-4">
                <p className="whitespace-pre-wrap text-sm">
                  {report.reason}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Trạng thái hiện tại
                </p>

                <div className="mt-2">
                  <UserReportStatusBadge
                    status={report.status}
                  />
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Ngày gửi
                </p>

                <p className="mt-2 text-sm">
                  {formatDate(
                    report.created_at,
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Người xử lý
                </p>

                <p className="mt-2 text-sm">
                  {report.handled_by ??
                    '-'}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Ngày xử lý
                </p>

                <p className="mt-2 text-sm">
                  {formatDate(
                    report.handled_at,
                  )}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">
                  Cập nhật trạng thái
                </p>

                <p className="text-xs text-muted-foreground">
                  Trạng thái được giới hạn theo
                  quy trình xử lý của backend.
                </p>
              </div>

              <Select
                value={
                  selectedStatus ??
                  report.status
                }
                onValueChange={(value) =>
                  setSelectedStatus(
                    value as UserReportStatus,
                  )
                }
                disabled={
                  updating ||
                  report.status ===
                    'RESOLVED' ||
                  report.status ===
                    'REJECTED'
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {availableStatuses.map(
                    (status) => (
                      <SelectItem
                        key={status}
                        value={status}
                      >
                        {getStatusLabel(
                          status,
                        )}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>

              {updateError && (
                <p className="text-sm text-destructive">
                  {updateError.message}
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={updating}
          >
            Đóng
          </Button>

          {report &&
            selectedStatus &&
            selectedStatus !==
              report.status &&
            report.status !==
              'RESOLVED' &&
            report.status !==
              'REJECTED' && (
              <Button
                onClick={handleUpdate}
                disabled={updating}
              >
                {updating
                  ? 'Đang cập nhật...'
                  : 'Cập nhật'}
              </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}