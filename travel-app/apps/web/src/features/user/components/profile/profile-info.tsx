import {
  CalendarDays,
  MapPin,
  UserRound,
} from 'lucide-react';

import type { UserProfile } from '../../types/profile';

interface ProfileInfoProps {
  profile: UserProfile;
}

export function ProfileInfo({
  profile,
}: ProfileInfoProps) {
  return (
    <section className="rounded-2xl border bg-card p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold">
          About
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Personal information
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoItem
          icon={<UserRound className="h-4 w-4" />}
          label="Username"
          value={`@${profile.username}`}
        />

        <InfoItem
          icon={<UserRound className="h-4 w-4" />}
          label="Display name"
          value={profile.display_name}
        />

        {profile.gender && (
          <InfoItem
            icon={<UserRound className="h-4 w-4" />}
            label="Gender"
            value={profile.gender}
          />
        )}

        {profile.birthday && (
          <InfoItem
            icon={<CalendarDays className="h-4 w-4" />}
            label="Birthday"
            value={profile.birthday}
          />
        )}

        {profile.location && (
          <InfoItem
            icon={<MapPin className="h-4 w-4" />}
            label="Location"
            value={profile.location}
          />
        )}
      </div>
    </section>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}

function InfoItem({
  icon,
  label,
  value,
}: InfoItemProps) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-muted/20 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}