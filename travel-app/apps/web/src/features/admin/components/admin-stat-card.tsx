'use client';
import type { LucideIcon } from 'lucide-react';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export default function AdminStatCard({ title, value, icon: Icon}: AdminStatCardProps) {
  return (
    <div className="rounded-lg border bg-card px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">
            {title}
          </p>

          <p className="mt-1 text-xl font-bold tracking-tight">
            {value}
          </p>
        </div>

        <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
      </div>
    </div>
  );
}