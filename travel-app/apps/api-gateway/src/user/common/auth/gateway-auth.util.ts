import { UnauthorizedException } from '@nestjs/common';

export function getAuthorization(context: any): string {

  const authorization = context.req?.headers?.authorization;
  if (authorization) {
    return authorization;
  }

  const token = context.req?.cookies?.accessToken;
  if (token) {
    return `Bearer ${token}`;
  }

  throw new UnauthorizedException( 'Authorization token is missing');
}