"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  Map,
  MapPin,
  Heart,
  Hash,
  Flag,
} from "lucide-react";

import {
  usePathname,
} from "next/navigation";

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Map,
  },
  {
    label: "Locations",
    href: "/admin/locations",
    icon: MapPin,
  },
  {
    label: "Interests",
    href: "/admin/interests",
    icon: Heart,
  },
  {
    label: "Hashtags",
    href: "/admin/hashtags",
    icon: Hash,
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: Flag,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">
          Travel Social
        </h1>
      </div>

      <nav className="space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3
                rounded-lg px-4 py-3
                text-sm font-medium
                transition
                ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }
              `}
            >
              <Icon className="h-5 w-5" />

              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}