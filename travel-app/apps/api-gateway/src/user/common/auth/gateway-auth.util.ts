export function getAuthorization(
  context: any,
): string | undefined {
  const authorization =
    context.req?.headers?.authorization;

  if (authorization) {
    return authorization;
  }

  const token =
    context.req?.cookies?.accessToken;

  if (token) {
    return `Bearer ${token}`;
  }

  return undefined;
}