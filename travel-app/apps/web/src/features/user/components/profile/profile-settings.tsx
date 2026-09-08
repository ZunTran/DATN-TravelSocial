'use client';

import {
  ChevronRight,
  Lock,
  Shield,
  UserRound,
  Ban,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProfileSettingsProps {
  onEditProfile?: () => void;
  onPrivacy?: () => void;
  onBlockList?: () => void;
  onBanHistory?: () => void;
}

export default function ProfileSettings({
  onEditProfile,
  onPrivacy,
  onBlockList,
  onBanHistory,
}: ProfileSettingsProps) {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <div className="border-b p-5">
        <h2 className="font-semibold">
          Profile settings
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile and account settings.
        </p>
      </div>

      <div className="p-2">
        <SettingButton
          icon={<UserRound className="h-4 w-4" />}
          title="Edit profile"
          description="Update your personal information"
          onClick={onEditProfile}
        />

        <SettingButton
          icon={<Lock className="h-4 w-4" />}
          title="Privacy settings"
          description="Manage who can interact with you"
          onClick={onPrivacy}
        />

        <SettingButton
          icon={<Ban className="h-4 w-4" />}
          title="Block list"
          description="Manage blocked users"
          onClick={onBlockList}
        />

        <SettingButton
          icon={<Shield className="h-4 w-4" />}
          title="Ban history"
          description="View your account moderation history"
          onClick={onBanHistory}
        />
      </div>
    </Card>
  );
}

interface SettingButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

function SettingButton({
  icon,
  title,
  description,
  onClick,
}: SettingButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="h-auto w-full justify-between rounded-xl px-3 py-3 text-left"
      onClick={onClick}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium">
            {title}
          </p>

          <p className="truncate text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Button>
  );
}