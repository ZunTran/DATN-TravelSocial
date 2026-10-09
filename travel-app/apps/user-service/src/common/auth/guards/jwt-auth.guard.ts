import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    console.log( '[USER JWT GUARD]', req?.headers?.authorization ? 'AUTH EXISTS' : 'AUTH MISSING');

    return req;
  }
}