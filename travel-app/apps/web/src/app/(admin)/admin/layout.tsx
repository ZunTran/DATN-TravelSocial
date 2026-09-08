"use client";

import { usePathname } from "next/navigation";
import {
  AdminAuthProvider,
} from "@/features/admin/context/admin-auth-context";

import {
  AdminApolloProvider,
} from "@/features/admin/components/admin-apollo-provider";

import AdminSidebar from
  "@/features/admin/components/admin-sidebar";

import AdminHeader from
  "@/features/admin/components/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLoginPage =
    pathname === "/admin/login";
  if (isLoginPage) {
    return (
      <AdminApolloProvider>
        {children}
      </AdminApolloProvider>
    );
  }

  return (
    <AdminAuthProvider>
      <AdminApolloProvider>
        <div className="min-h-screen bg-muted/30">
          <AdminSidebar />

          <div className="pl-64">
            <AdminHeader />

            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      </AdminApolloProvider>
    </AdminAuthProvider>
  );
}