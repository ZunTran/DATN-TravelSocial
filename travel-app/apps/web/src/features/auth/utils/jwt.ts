export interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export function decodeJwt(
  token: string,
): JwtPayload | null {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const decoded = atob(
      payload
        .replace(/-/g, "+")
        .replace(/_/g, "/"),
    );

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function isAdminToken(
  token: string,
): boolean {
  const payload = decodeJwt(token);

  return payload?.role === "ADMIN";
}