"use client";

import {
  Plane,
  MapPin,
  Compass,
  Camera,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function AuthShell({
  children,
  title,
  description,
}: AuthShellProps) {
  return (
    <div className="min-h-svh bg-gradient-to-br from-background via-background to-accent/40 px-4 py-8 sm:py-12">
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-2">

        {/* LEFT BRAND */}

        <div className="hidden lg:block">
          <div className="max-w-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <Plane className="size-5" />
              </div>

              <div>
                <p className="font-bold tracking-tight">
                  Travel Social
                </p>

                <p className="text-xs text-muted-foreground">
                  Explore. Share. Travel.
                </p>
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Discover places.
              <br />
              Share your journey.
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Connect with travelers, discover
              interesting destinations and plan
              your next adventure.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <Feature
                icon={<Compass />}
                text="Explore"
              />

              <Feature
                icon={<MapPin />}
                text="Discover"
              />

              <Feature
                icon={<Camera />}
                text="Share"
              />
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}

        <div className="mx-auto w-full max-w-md">
          <Card className="overflow-hidden rounded-3xl border-border/70 shadow-xl shadow-primary/5">
            <CardContent className="p-7 sm:p-9">

              <div className="mb-7 lg:hidden">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Plane className="size-6" />
                </div>

                <p className="text-center text-sm font-semibold">
                  Travel Social
                </p>
              </div>

              <div className="mb-7">
                <h1 className="text-2xl font-bold tracking-tight">
                  {title}
                </h1>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>

              {children}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="rounded-2xl border bg-card/70 p-4">
      <div className="mb-3 text-primary">
        {icon}
      </div>

      <p className="text-sm font-medium">
        {text}
      </p>
    </div>
  );
}