'use client';
import { Notification } from "../../user-nortification/types/notification";

interface NotificationItemProps {
  notification: Notification;

  onRead?: (
    notificationId: string,
  ) => void;
}

export function NotificationItem({
  notification,
  onRead,
}: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.isRead) {
      onRead?.(notification.id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex w-full gap-3 border-b p-4 text-left transition ${
        notification.isRead
          ? 'bg-background'
          : 'bg-muted/40'
      }`}
    >
      <div className="flex-1">
        <p className="text-sm">
          {notification.message}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {formatNotificationDate(
            notification.createdAt,
          )}
        </p>
      </div>

      {!notification.isRead && (
        <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
      )}
    </button>
  );
}

function formatNotificationDate(
  value: string,
) {
  const date = new Date(value);

  return date.toLocaleString('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}