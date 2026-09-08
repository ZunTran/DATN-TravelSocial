const ADMIN_ACCESS_TOKEN_KEY =
  "adminAccessToken";

export function getAdminAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(
    ADMIN_ACCESS_TOKEN_KEY,
  );
}

export function setAdminAccessToken(
  token: string,
) {
  localStorage.setItem(
    ADMIN_ACCESS_TOKEN_KEY,
    token,
  );
}

export function removeAdminAccessToken() {
  localStorage.removeItem(
    ADMIN_ACCESS_TOKEN_KEY,
  );
}