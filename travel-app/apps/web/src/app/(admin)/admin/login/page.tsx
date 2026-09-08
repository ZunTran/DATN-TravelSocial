"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  useAdminLogin,
} from "@/features/admin/hooks/use-admin-login";

import {
  Input,
} from "@/components/ui/input";

import {
  Button,
} from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();

  const {
    login,
    loading,
  } = useAdminLogin();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setError("");

    try {
      await login(
        email,
        password,
      );

      router.replace("/admin");
    } catch (error: any) {
      setError(
        error?.message ||
          "Đăng nhập thất bại",
      );
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Đăng nhập vào trang quản trị
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            disabled={loading}
          />

          <Input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            disabled={loading}
          />

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Đang đăng nhập..."
              : "Đăng nhập"}
          </Button>
        </form>
      </div>
    </div>
  );
}