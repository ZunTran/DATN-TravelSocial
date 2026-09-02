"use client";

import { useEffect, useState } from "react";

import {
  Calendar,
  FileText,
  MapPin,
  User,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import type {
  UserProfile,
} from "../types/profile";

interface ProfileFormProps {
  profile: UserProfile;
  onCancel: () => void;
  onSubmit?: (
    values: Partial<UserProfile>,
  ) => Promise<void>;
}

export function ProfileForm({
  profile,
  onCancel,
  onSubmit,
}: ProfileFormProps) {
  const [
    username,
    setUsername,
  ] = useState(profile.username);

  const [
    displayName,
    setDisplayName,
  ] = useState(
    profile.display_name,
  );

  const [bio, setBio] = useState(
    profile.bio ?? "",
  );

  const [
    location,
    setLocation,
  ] = useState(
    profile.location ?? "",
  );

  const [
    birthday,
    setBirthday,
  ] = useState(
    profile.birthday
      ? profile.birthday.slice(0, 10)
      : "",
  );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  useEffect(() => {
    setUsername(profile.username);
    setDisplayName(
      profile.display_name,
    );
    setBio(profile.bio ?? "");
    setLocation(
      profile.location ?? "",
    );

    setBirthday(
      profile.birthday
        ? profile.birthday.slice(
            0,
            10,
          )
        : "",
    );
  }, [profile]);

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    if (!onSubmit) {
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit({
        username,
        display_name: displayName,
        bio,
        location,
        birthday:
          birthday || null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold">
          Edit profile
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Update your profile information.
        </p>
      </div>

      {/* Username */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <User className="size-4" />
          Username
        </label>

        <Input
          value={username}
          onChange={(event) =>
            setUsername(
              event.target.value,
            )
          }
          disabled={submitting}
        />
      </div>

      {/* Display name */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Display name
        </label>

        <Input
          value={displayName}
          onChange={(event) =>
            setDisplayName(
              event.target.value,
            )
          }
          disabled={submitting}
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <FileText className="size-4" />
          Bio
        </label>

        <Textarea
          value={bio}
          onChange={(event) =>
            setBio(event.target.value)
          }
          rows={4}
          placeholder="Tell people about yourself..."
          disabled={submitting}
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="size-4" />
          Location
        </label>

        <Input
          value={location}
          onChange={(event) =>
            setLocation(
              event.target.value,
            )
          }
          disabled={submitting}
        />
      </div>

      {/* Birthday */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <Calendar className="size-4" />
          Birthday
        </label>

        <Input
          type="date"
          value={birthday}
          onChange={(event) =>
            setBirthday(
              event.target.value,
            )
          }
          disabled={submitting}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            submitting || !onSubmit
          }
        >
          {submitting
            ? "Saving..."
            : "Save changes"}
        </Button>
      </div>
    </form>
  );
}