import { GatewayUserProfile } from "./types/profile.type";


function toDate(
  value: string | Date | null | undefined,
): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

export function mapGatewayUserProfile(
  profile: any,
): GatewayUserProfile {
  return {
    ...profile,

    birthday: toDate(profile.birthday),

    created_at: toDate(profile.created_at),

    updated_at: toDate(profile.updated_at),
  };
}