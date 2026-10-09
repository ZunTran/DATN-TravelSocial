'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserReportStatus } from '../../user-report/types/user-report.types';

interface AdminUserReportFilterProps {
  status?: UserReportStatus;
  onStatusChange: (
    status?: UserReportStatus,
  ) => void;
}

export function AdminUserReportFilter({
  status,
  onStatusChange,
}: AdminUserReportFilterProps) {
  return (
    <div className="w-[220px]">
      <Select
        value={status ?? 'ALL'}
        onValueChange={(value) => {
          if (value === 'ALL') {
            onStatusChange(undefined);
            return;
          }

          onStatusChange(
            value as UserReportStatus,
          );
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">
            Tất cả
          </SelectItem>

          <SelectItem value="PENDING">
            Chờ xử lý
          </SelectItem>

          <SelectItem value="REVIEWING">
            Đang xem xét
          </SelectItem>

          <SelectItem value="RESOLVED">
            Đã xử lý
          </SelectItem>

          <SelectItem value="REJECTED">
            Từ chối
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}