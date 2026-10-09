"use client";

import { useProfile } from "@/features/user/user-profile/hooks/use-profile";

export function ProfileInitializer() {
  useProfile();

  return null;
}