'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { useReportUser } from '../../user-report/hooks/use-report-user';

interface ReportUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportedUserId: string;
  reportedUsername?: string;
}

const MAX_REASON_LENGTH = 1000;

export function ReportUserDialog({
  open,
  onOpenChange,
  reportedUserId,
  reportedUsername,
}: ReportUserDialogProps) {
  const [reason, setReason] = useState('');

  const {
    reportUser,
    loading,
    reset,
  } = useReportUser();

  useEffect(() => {
    if (!open) {
      setReason('');
      reset();
    }
  }, [open, reset]);

  const handleSubmit = async () => {
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      toast.error('Vui lòng nhập lý do báo cáo.');
      return;
    }

    try {
      await reportUser({
        reportedUserId,
        reason: trimmedReason,
      });
      toast.success( 'Báo cáo đã được gửi thành công.' );

      setReason('');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || 'Không thể gửi báo cáo.' );
    }
  };

  const remainingCharacters =
    MAX_REASON_LENGTH - reason.length;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Báo cáo người dùng
          </DialogTitle>

          <DialogDescription>
            {reportedUsername
              ? `Bạn đang báo cáo @${reportedUsername}.`
              : 'Vui lòng cho biết lý do báo cáo.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <Label htmlFor="report-reason">
            Lý do báo cáo
          </Label>

          <Textarea
            id="report-reason"
            value={reason}
            onChange={(event) =>
              setReason(event.target.value)
            }
            placeholder="Nhập lý do bạn muốn báo cáo người dùng này..."
            maxLength={MAX_REASON_LENGTH}
            rows={6}
            disabled={loading}
          />

          <div className="flex justify-end text-xs text-muted-foreground">
            <span>
              {remainingCharacters} ký tự còn lại
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              loading ||
              !reason.trim()
            }
          >
            {loading
              ? 'Đang gửi...'
              : 'Gửi báo cáo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}