"use client";

import { useState } from "react";

import type { UserProfile } from "../../types/profile";
import { useRouter } from "next/navigation";

interface ProfileSetupProps {
  profile: UserProfile;

  onUpdate: (
    input: {
      username: string;
      display_name: string;
      bio?: string;
      gender?: string;
      birthday?: string;
      location?: string;
    },
  ) => Promise<UserProfile>;
}

export default function ProfileSetup({
  profile,
  onUpdate,
}: ProfileSetupProps) {
  const router = useRouter();

  const [username, setUsername] = useState(
    profile.username ?? "",
  );

  const [displayName, setDisplayName] =
    useState(
      profile.display_name ?? "",
    );

  const [bio, setBio] = useState(
    profile.bio ?? "",
  );

  const [gender, setGender] = useState(
    profile.gender ?? "",
  );

  const [birthday, setBirthday] =
    useState(
      profile.birthday ?? "",
    );

  const [location, setLocation] =
    useState(
      profile.location ?? "",
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

try {
  await onUpdate({
    username,
    display_name: displayName,
    bio: bio || undefined,
    gender: gender || undefined,
    birthday: birthday || undefined,
    location: location || undefined,
  });

  router.push("/setup-interests");
} catch (err: any) {
  setError(
    err?.message ??
      "Không thể cập nhật profile.",
  );
} finally {
  setLoading(false);
}
  };

  return (
    <div className="mx-auto max-w-xl py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Complete your profile
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Tell us a little about yourself.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* USERNAME */}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Username
          </label>

          <input
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className="w-full rounded-lg border px-3 py-2"
            placeholder="your_username"
            required
          />
        </div>

        {/* DISPLAY NAME */}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Display name
          </label>

          <input
            value={displayName}
            onChange={(e) =>
              setDisplayName(e.target.value)
            }
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Your name"
            required
          />
        </div>

        {/* BIO */}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Bio
          </label>

          <textarea
            value={bio}
            onChange={(e) =>
              setBio(e.target.value)
            }
            className="min-h-24 w-full rounded-lg border px-3 py-2"
            placeholder="Tell people about yourself..."
          />
        </div>

        {/* GENDER */}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Gender
          </label>

          <select
            value={gender}
            onChange={(e) =>
              setGender(e.target.value)
            }
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="">
              Select gender
            </option>

            <option value="MALE">
              Male
            </option>

            <option value="FEMALE">
              Female
            </option>

            <option value="OTHER">
              Other
            </option>
          </select>
        </div>

        {/* BIRTHDAY */}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Birthday
          </label>

          <input
            type="date"
            value={birthday}
            onChange={(e) =>
              setBirthday(e.target.value)
            }
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* LOCATION */}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Location
          </label>

          <input
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Ho Chi Minh City"
          />
        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : "Continue"}
        </button>
      </form>
    </div>
  );
}
