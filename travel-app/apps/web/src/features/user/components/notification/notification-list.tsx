'use client';
import { Notification } from '../../user-nortification/types/notification';
import { NotificationItem } from './notification-item';

interface NotificationListProps {
  notifications: Notification[];
  loading?: boolean;
  onRead?: ( notificationId: string ) => void;
}

export function NotificationList({
  notifications,
  loading,
  onRead,
}: NotificationListProps) {
  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">Đang tải thông báo..</div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">Chưa có thông báo</div>
    );
  }

  return (
    <div className="divide-y">
      {notifications.map(
        (notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRead={onRead}
          />
        ),
      )}
    </div>
  );
}