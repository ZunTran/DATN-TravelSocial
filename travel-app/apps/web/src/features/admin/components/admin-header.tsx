"use client";

import {
  Button,
} from "@/components/ui/button";

import {
  useAdminAuth,
} from "@/features/admin/context/admin-auth-context";

export default function AdminHeader() {
  const { logout } =
    useAdminAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h2 className="font-semibold">
          Admin Panel
        </h2>
      </div>

      <Button
        variant="outline"
        onClick={logout}
      >
        Đăng xuất
      </Button>
    </header>
  );
}