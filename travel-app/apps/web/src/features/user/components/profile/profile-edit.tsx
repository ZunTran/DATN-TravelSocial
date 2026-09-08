'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  ArrowLeft,
  Save,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import { Textarea } from '@/components/ui/textarea';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { UserProfile } from '../../types/profile';

import { useUpdateProfile } from '../../hooks/use-update-profile';

interface ProfileEditProps {
  profile: UserProfile;

  onCancel?: () => void;

  onSuccess?: (
    profile: UserProfile,
  ) => void;
}

interface ProfileEditFormValues {
  username: string;
  display_name: string;
  bio: string;
  gender: string;
  birthday: string;
  location: string;
  privacy: string;
}

export default function ProfileEdit({
  profile,
  onCancel,
  onSuccess,
}: ProfileEditProps) {
  const {
    updateProfile,
    loading,
    error,
  } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<ProfileEditFormValues>({
    defaultValues: {
      username:
        profile.username ?? '',

      display_name:
        profile.display_name ?? '',

      bio:
        profile.bio ?? '',

      gender:
        profile.gender ?? '',

      birthday:
        profile.birthday
          ? profile.birthday.slice(0, 10)
          : '',

      location:
        profile.location ?? '',

      privacy:
        profile.privacy ?? 'PUBLIC',
    },
  });



  useEffect(() => {
    reset({
      username:
        profile.username ?? '',

      display_name:
        profile.display_name ?? '',

      bio:
        profile.bio ?? '',

      gender:
        profile.gender ?? '',

      birthday:
        profile.birthday
          ? profile.birthday.slice(0, 10)
          : '',

      location:
        profile.location ?? '',

      privacy:
        profile.privacy ?? 'PUBLIC',
    });
  }, [profile, reset]);

  const gender = watch('gender');
  const privacy = watch('privacy');


  const onSubmit = async (
    values: ProfileEditFormValues,
  ) => {
    try {
      const updatedProfile =
        await updateProfile({
          username:
            values.username.trim(),

          display_name:
            values.display_name.trim(),

          bio:
            values.bio.trim() || null,

          gender:
            values.gender || null,

          birthday:
            values.birthday || null,

          location:
            values.location.trim() || null,

          privacy:
            values.privacy,
        });

      onSuccess?.(updatedProfile);
    } catch {
      // Error được expose qua useUpdateProfile()
    }
  };

  return (
    <Card className="rounded-2xl">
      {/* HEADER */}
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg">
            Edit profile
          </CardTitle>

          <p className="mt-1 text-sm text-muted-foreground">
            Update your personal profile information
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          className="rounded-full"
          onClick={onCancel}
          disabled={loading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </CardHeader>


      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >

          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium"
            >
              Username
            </label>

            <Input
              id="username"
              {...register('username')}
              placeholder="Enter username"
              disabled={loading}
            />
          </div>


          <div className="space-y-2">
            <label
              htmlFor="display_name"
              className="text-sm font-medium"
            >
              Display name
            </label>

            <Input
              id="display_name"
              {...register('display_name')}
              placeholder="Enter display name"
              disabled={loading}
            />
          </div>


          <div className="space-y-2">
            <label
              htmlFor="bio"
              className="text-sm font-medium"
            >
              Bio
            </label>

            <Textarea
              id="bio"
              {...register('bio')}
              placeholder="Tell people about yourself"
              className="min-h-[110px] resize-none"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Gender
            </label>

            <Select
              value={gender}
              onValueChange={(value) =>
                setValue('gender', value)
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="MALE">
                  Male
                </SelectItem>

                <SelectItem value="FEMALE">
                  Female
                </SelectItem>

                <SelectItem value="OTHER">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>


          <div className="space-y-2">
            <label
              htmlFor="birthday"
              className="text-sm font-medium"
            >
              Birthday
            </label>

            <Input
              id="birthday"
              type="date"
              {...register('birthday')}
              disabled={loading}
            />
          </div>


          <div className="space-y-2">
            <label
              htmlFor="location"
              className="text-sm font-medium"
            >
              Location
            </label>

            <Input
              id="location"
              {...register('location')}
              placeholder="Enter your location"
              disabled={loading}
            />
          </div>

          {/* PRIVACY */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Privacy
            </label>

            <Select
              value={privacy}
              onValueChange={(value) =>
                setValue('privacy', value)
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select privacy" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="PUBLIC">
                  Public
                </SelectItem>

                <SelectItem value="PRIVATE">
                  Private
                </SelectItem>
              </SelectContent>
            </Select>
          </div>


          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-destructive">
                {error.message}
              </p>
            </div>
          )}


          <div className="flex justify-end gap-3 border-t pt-5">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="rounded-full"
              disabled={loading}
            >
              <Save className="mr-2 h-4 w-4" />

              {loading
                ? 'Saving...'
                : 'Save changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

