'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import type { UserProfile } from '../../types/profile';

interface ProfilePersonalInfoProps {
  profile: UserProfile;
  onEditProfile?: () => void;
}

export default function ProfilePersonalInfo({
  profile,
  onEditProfile,
}: ProfilePersonalInfoProps) {
  const formatBirthday = (
    birthday: string | null | undefined,
  ) => {
    if (!birthday) {
      return 'Not provided';
    }

    const date = new Date(birthday);

    if (Number.isNaN(date.getTime())) {
      return birthday;
    }

    return date.toLocaleDateString('en-GB');
  };

  const formatGender = (
    gender: string | null | undefined,
  ) => {
    if (!gender) {
      return 'Not provided';
    }

    return gender.charAt(0) + gender.slice(1).toLowerCase();
  };

  const formatPrivacy = (
    privacy: string | null | undefined,
  ) => {
    if (!privacy) {
      return 'Not provided';
    }

    return privacy.charAt(0) + privacy.slice(1).toLowerCase();
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg">
            Personal information
          </CardTitle>

          <p className="mt-1 text-sm text-muted-foreground">
            Your personal profile information
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="shrink-0 rounded-full"
          onClick={onEditProfile}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit profile
        </Button>
      </CardHeader>

      <CardContent>
        <div className="divide-y rounded-xl border">
          {/* USERNAME */}
          <InfoRow
            label="Username"
            value={`@${profile.username}`}
          />

          {/* DISPLAY NAME */}
          <InfoRow
            label="Display name"
            value={
              profile.display_name ||
              'Not provided'
            }
          />

          {/* BIO */}
          <InfoRow
            label="Bio"
            value={profile.bio || 'Not provided'}
          />

          {/* GENDER */}
          <InfoRow
            label="Gender"
            value={formatGender(profile.gender)}
          />

          {/* BIRTHDAY */}
          <InfoRow
            label="Birthday"
            value={formatBirthday(profile.birthday)}
          />

          {/* LOCATION */}
          <InfoRow
            label="Location"
            value={
              profile.location ||
              'Not provided'
            }
          />

          {/* PRIVACY */}
          <InfoRow
            label="Privacy"
            value={formatPrivacy(profile.privacy)}
          />

          {/* CREATED AT */}
          <InfoRow
            label="Member since"
            value={new Date(
              profile.created_at,
            ).toLocaleDateString('en-GB')}
          />

          {/* UPDATED AT */}
          <InfoRow
            label="Last updated"
            value={new Date(
              profile.updated_at,
            ).toLocaleDateString('en-GB')}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <div className="grid gap-1 px-4 py-4 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-6">
      <p className="text-sm font-medium text-muted-foreground">
        {label}
      </p>

      <p className="text-sm font-medium break-words">
        {value}
      </p>
    </div>
  );
}