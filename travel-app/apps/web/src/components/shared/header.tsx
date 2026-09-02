"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Bell,
  LogOut,
  Search,
  User,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { useAuthContext } from "@/features/auth/context/auth-context";

export function Header() {
  const router = useRouter();

  const { logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(
        "[Header] Logout failed:",
        error,
      );
    } finally {
      /*
       * AuthContext đã:
       * 1. gọi logout API
       * 2. setAccessToken(null)
       * 3. clearAccessToken()
       *
       * Sau đó Header đưa user về login.
       */
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b bg-background/90 px-4 backdrop-blur-xl">
      <div className="flex w-full items-center gap-3">

        {/* SIDEBAR */}

        <SidebarTrigger
          className="
            size-9
            rounded-lg
            hover:bg-accent
            hover:text-accent-foreground
          "
        />

        <div className="hidden h-6 w-px bg-border md:block" />

        {/* LOGO */}

        <Link
          href="/"
          className="hidden items-center gap-2.5 md:flex"
        >
          <div
            className="
              flex
              size-9
              items-center
              justify-center
              rounded-xl
              bg-primary
              text-primary-foreground
              shadow-sm
            "
          >
            <span className="text-lg">
              ✈
            </span>
          </div>

          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight text-foreground">
              Travel Social
            </p>

            <p className="text-[11px] text-muted-foreground">
              Explore. Connect. Travel.
            </p>
          </div>
        </Link>

        {/* SEARCH */}

        <div
          className="
            relative
            ml-2
            hidden
            w-full
            max-w-lg
            md:block
          "
        >
          <Search
            className="
              absolute
              left-3.5
              top-1/2
              size-4
              -translate-y-1/2
              text-muted-foreground
            "
          />

          <Input
            placeholder="Search destinations, people..."
            className="
              h-10
              rounded-xl
              border-border/70
              bg-muted/50
              pl-10
              pr-4
              shadow-none
              transition-all
              placeholder:text-muted-foreground/70
              focus-visible:bg-background
              focus-visible:ring-2
              focus-visible:ring-primary/20
            "
          />
        </div>

        {/* RIGHT ACTIONS */}

        <div className="ml-auto flex items-center gap-1">

          {/* MOBILE SEARCH */}

          <Button
            variant="ghost"
            size="icon"
            className="
              size-9
              rounded-xl
              text-muted-foreground
              hover:bg-accent
              hover:text-primary
              md:hidden
            "
          >
            <Search className="size-5" />

            <span className="sr-only">
              Search
            </span>
          </Button>

          {/* FRIENDS */}

          <Button
            variant="ghost"
            size="icon"
            className="
              relative
              size-9
              rounded-xl
              text-muted-foreground
              hover:bg-accent
              hover:text-primary
            "
            asChild
          >
            <Link href="/friends">
              <UsersRound className="size-5" />

              <span
                className="
                  absolute
                  right-1
                  top-1
                  size-2
                  rounded-full
                  bg-amber-500
                  ring-2
                  ring-background
                "
              />

              <span className="sr-only">
                Friends
              </span>
            </Link>
          </Button>

          {/* NOTIFICATIONS */}

          <Button
            variant="ghost"
            size="icon"
            className="
              relative
              size-9
              rounded-xl
              text-muted-foreground
              hover:bg-accent
              hover:text-primary
            "
            asChild
          >
            <Link href="/notifications">
              <Bell className="size-5" />

              <span
                className="
                  absolute
                  right-1
                  top-1
                  size-2
                  rounded-full
                  bg-red-500
                  ring-2
                  ring-background
                "
              />

              <span className="sr-only">
                Notifications
              </span>
            </Link>
          </Button>

          <div className="mx-2 hidden h-6 w-px bg-border sm:block" />

          {/* PROFILE */}

          <Link
            href="/profile/me"
            className="
              group
              flex
              items-center
              gap-2
              rounded-xl
              p-1.5
              pr-2.5
              transition-colors
              hover:bg-accent
            "
          >
            <div
              className="
                flex
                size-8
                items-center
                justify-center
                rounded-lg
                bg-primary/10
                text-primary
                transition-colors
                group-hover:bg-primary
                group-hover:text-primary-foreground
              "
            >
              <User className="size-4" />
            </div>

            <div className="hidden text-left leading-tight sm:block">
              <p className="text-sm font-semibold">
                Dung
              </p>

              <p className="text-[11px] text-muted-foreground">
                Traveler
              </p>
            </div>
          </Link>

          {/* LOGOUT */}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="
              size-9
              rounded-xl
              text-muted-foreground
              hover:bg-destructive/10
              hover:text-destructive
            "
            title="Đăng xuất"
          >
            <LogOut className="size-5" />

            <span className="sr-only">
              Logout
            </span>
          </Button>

        </div>
      </div>
    </header>
  );
}