"use client";

import Link from "next/link";

import {
  Home,
  Compass,
  Map,
  MessageCircle,
  User,
} from "lucide-react";

const navigation = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Explore",
    href: "/explore",
    icon: Compass,
  },
  {
    title: "Travel AI",
    href: "/travel-ai",
    icon: Map,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageCircle,
  },
  {
    title: "Profile",
    href: "/profile/me",
    icon: User,
  },
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background md:hidden">
      <div className="grid h-16 grid-cols-5">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Icon className="size-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
