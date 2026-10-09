'use client';

import { useState } from 'react';

import {
  NotificationList,
} from './notification-list';
import { useNotifications } from '../../user-nortification/hooks/use-notifications';


export function NotificationPanel() {
  const [page, setPage] =
    useState(1);

  const limit = 10;

  const {
    notifications,
    total,
    totalPages,
    loading,
    markAsRead,
    markAllAsRead,
    markingAllAsRead,
  } = useNotifications(
    page,
    limit,
  );

  const goPrevious = () => {
    if (page > 1) {
      setPage((value) => value - 1);
    }
  };

  const goNext = () => {
    if (page < totalPages) {
      setPage((value) => value + 1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h1 className="text-lg font-semibold">
            Thông báo
          </h1>

          <p className="text-sm text-muted-foreground">
            {total} thông báo
          </p>
        </div>

        <button
          type="button"
          onClick={markAllAsRead}
          disabled={
            markingAllAsRead ||
            notifications.every(
              (notification) =>
                notification.isRead,
            )
          }
          className="text-sm text-primary disabled:opacity-50"
        >Đánh dấu tất cả đã đọc</button>
      </div>

      <NotificationList
        notifications={notifications}
        loading={loading}
        onRead={markAsRead}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t p-4">
          <button
            type="button"
            onClick={goPrevious}
            disabled={
              page === 1 || loading
            }
            className="rounded border px-3 py-2 text-sm disabled:opacity-50"
          >Trước</button>

          <span className="text-sm text-muted-foreground"> Trang {page} / {totalPages}</span>

          <button
            type="button"
            onClick={goNext}
            disabled={
              page === totalPages ||
              loading
            }
            className="rounded border px-3 py-2 text-sm disabled:opacity-50"
          >Sau</button>
        </div>
      )}
    </div>
  );
}