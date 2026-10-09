'use client';

import {
  Badge,
} from '@/components/ui/badge';
import { UserReportStatus } from '../../user-report/types/user-report.types';


interface UserReportStatusBadgeProps {
  status: UserReportStatus;
}

const statusConfig: Record<
  UserReportStatus,
  {
    label: string;
  }
> = {
  PENDING: {
    label: 'Chờ xử lý',
  },

  REVIEWING: {
    label: 'Đang xem xét',
  },

  RESOLVED: {
    label: 'Đã xử lý',
  },

  REJECTED: {
    label: 'Từ chối',
  },
};

export function UserReportStatusBadge({
  status,
}: UserReportStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline">
      {config.label}
    </Badge>
  );
}