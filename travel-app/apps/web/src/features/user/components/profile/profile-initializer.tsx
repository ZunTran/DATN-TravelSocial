"use client";

import { useProfile } from "@/features/user/hooks/use-profile";

export function ProfileInitializer() {
  useProfile();

  return null;
}