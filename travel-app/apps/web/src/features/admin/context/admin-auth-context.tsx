"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  getAdminAccessToken,
  removeAdminAccessToken,
} from "@/services/auth/admin-token-store";

import {
  decodeJwt,
} from "@/features/auth/utils/jwt";

interface AdminAuthContextValue {
  token: string | null;
  isAdmin: boolean;
  logout: () => void;
}

const AdminAuthContext =
  createContext<
    AdminAuthContextValue | undefined
  >(undefined);

export function AdminAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [token, setToken] =
    useState<string | null>(null);

  const [isAdmin, setIsAdmin] =
    useState(false);

  useEffect(() => {
    const storedToken =
      getAdminAccessToken();

    if (!storedToken) {
      router.replace("/admin/login");
      return;
    }

    const payload =
      decodeJwt(storedToken);

    if (
      !payload ||
      payload.role !== "ADMIN"
    ) {
      removeAdminAccessToken();

      router.replace("/admin/login");
      return;
    }

    setToken(storedToken);
    setIsAdmin(true);
  }, [router]);

  const logout = () => {
    removeAdminAccessToken();

    setToken(null);
    setIsAdmin(false);

    router.replace("/admin/login");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        isAdmin,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context =
    useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth must be used inside AdminAuthProvider",
    );
  }

  return context;
}