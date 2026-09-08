import { CookieOptions } from 'express';

export function getRefreshCookieOptions(): CookieOptions {
  const isProduction =
    process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',

    maxAge:
      30 *
      24 *
      60 *
      60 *
      1000,
  };
}