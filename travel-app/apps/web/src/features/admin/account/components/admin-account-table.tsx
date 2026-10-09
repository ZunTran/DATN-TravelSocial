'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { useAdminAccounts } from '../hooks/use-admin-accounts';

export function AdminAccountTable() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [enabled, setEnabled] = useState(false);

  const tableRef =
    useRef<HTMLDivElement | null>(null);

  const limit = 10;

  const {
    accounts,
    pagination,
    loading,
    error,
  } = useAdminAccounts({
    search,
    page,
    limit,
    enabled,
  });

  useEffect(() => {
    const element = tableRef.current;

    if (!element || enabled) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEnabled(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: '300px',
        },
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [enabled]);

  const totalPages =
    pagination.totalPages;

  const start =
    pagination.total === 0
      ? 0
      : (page - 1) * limit + 1;

  const end = Math.min(
    page * limit,
    pagination.total,
  );

  const handlePrevious = () => {
    setPage((currentPage) => {
      const nextPage = Math.max(
        currentPage - 1,
        1,
      );

      console.log(
        '[AdminAccountTable] PREVIOUS',
        {
          currentPage,
          nextPage,
        },
      );

      return nextPage;
    });
  };

  const handleNext = () => {
    setPage((currentPage) => {
      const nextPage = Math.min(
        currentPage + 1,
        totalPages,
      );

      console.log(
        '[AdminAccountTable] NEXT',
        {
          currentPage,
          nextPage,
          totalPages,
        },
      );

      return nextPage;
    });
  };

  console.log(
    '[AdminAccountTable] RENDER',
    {
      page,
      totalPages,
      enabled,
    },
  );

  if (!enabled) {
    return (
      <div
        ref={tableRef}
        className="min-h-[300px] rounded-xl border bg-card"
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold">
            Tài khoản
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Cuộn xuống để tải danh sách tài khoản.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={tableRef}
      className="rounded-xl border bg-card"
    >
      <div className="flex items-center justify-between gap-4 p-6">
        <div>
          <h2 className="text-lg font-semibold">
            Tài khoản
          </h2>

          <p className="text-sm text-muted-foreground">
            Danh sách người dùng trong hệ thống
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Tìm email, username..."
          className="w-64 rounded-md border bg-background px-3 py-2 text-sm outline-none"
        />
      </div>

      {error && (
        <div className="mx-6 mb-4 rounded-md border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
          Không thể tải danh sách tài khoản.
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y bg-muted/40">
              <th className="px-6 py-3 text-left font-medium">
                Email
              </th>

              <th className="px-6 py-3 text-left font-medium">
                Username
              </th>

              <th className="px-6 py-3 text-left font-medium">
                Tên hiển thị
              </th>

              <th className="px-6 py-3 text-left font-medium">
                Trạng thái
              </th>

              <th className="px-6 py-3 text-left font-medium">
                Hoạt động cuối
              </th>

              <th className="px-6 py-3 text-left font-medium">
                Ngày tạo
              </th>
            </tr>
          </thead>

          <tbody>
            {accounts.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-muted-foreground"
                >
                  Không có tài khoản.
                </td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr
                  key={account.id}
                  className="border-b last:border-0"
                >
                  <td className="px-6 py-4">
                    {account.email}
                  </td>

                  <td className="px-6 py-4">
                    {account.username ?? '-'}
                  </td>

                  <td className="px-6 py-4">
                    {account.displayName ?? '-'}
                  </td>

                  <td className="px-6 py-4">
                    {account.status}
                  </td>

                  <td className="px-6 py-4">
                    {account.lastLoginAt
                      ? new Date(
                          account.lastLoginAt,
                        ).toLocaleString('vi-VN')
                      : '-'}
                  </td>

                  <td className="px-6 py-4">
                    {new Date(
                      account.createdAt,
                    ).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="border-t px-6 py-3 text-center text-sm text-muted-foreground">
          Đang tải trang {page}...
        </div>
      )}

      <div className="flex items-center justify-between border-t px-6 py-4">
        <div className="text-sm text-muted-foreground">
          {pagination.total > 0
            ? `Hiển thị ${start}-${end} / ${pagination.total}`
            : 'Không có dữ liệu'}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={
              loading || page <= 1
            }
            onClick={handlePrevious}
            className="
              inline-flex
              h-8
              w-8
              items-center
              justify-center
              rounded-md
              border
              disabled:pointer-events-none
              disabled:opacity-40
            "
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="min-w-20 text-center text-sm">
            Trang {page} / {totalPages || 1}
          </span>

          <button
            type="button"
            disabled={
              loading ||
              totalPages === 0 ||
              page >= totalPages
            }
            onClick={handleNext}
            className="
              inline-flex
              h-8
              w-8
              items-center
              justify-center
              rounded-md
              border
              disabled:pointer-events-none
              disabled:opacity-40
            "
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}