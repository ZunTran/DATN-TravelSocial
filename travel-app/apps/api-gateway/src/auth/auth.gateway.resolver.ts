import {
  Args,
  Context,
  ID,
  InputType,
  Field,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { AuthGatewayService } from './auth.gateway.service';

import {
  GatewayLoginResponse,
  GatewayLoginSession,
} from './auth.gateway.types';

import { getRefreshCookieOptions } from './auth-cookie.config';

@InputType()
export class GatewayRegisterInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class GatewayLoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class GatewayForgotPasswordInput {
  @Field()
  email: string;
}

@InputType()
export class GatewayResetPasswordInput {
  @Field()
  token: string;

  @Field()
  password: string;
}

@InputType()
export class GatewayChangePasswordInput {
  @Field()
  oldPassword: string;

  @Field()
  newPassword: string;
}

@InputType()
export class GatewayOauthLoginInput {
  @Field()
  provider: string;

  @Field()
  providerUserId: string;

  @Field()
  email: string;
}

@Resolver()
export class AuthGatewayResolver {
  constructor(
    private readonly authGatewayService: AuthGatewayService,
  ) {}

  // ============================================================
  // REGISTER
  // ============================================================

  // @Mutation(() => String)
  // register(
  //   @Args('input') input: GatewayRegisterInput,
  // ) {
  //   return this.authGatewayService.register(input);
  // }

  @Mutation(() => GatewayLoginResponse)
async register(
  @Args('input')
  input: GatewayRegisterInput,

  @Context()
  context: any,
) {
  const result =
    await this.authGatewayService.register(
      input,
    );

  context.res.cookie(
    'refresh_token',
    result.refreshToken,
    getRefreshCookieOptions(),
  );

  return {
    accessToken:
      result.accessToken,
  };
}


  // ============================================================
  // LOGIN
  // ============================================================

  @Mutation(() => GatewayLoginResponse)
  async login(
    @Args('input') input: GatewayLoginInput,
    @Context() context: any,
  ) {
    const result =
      await this.authGatewayService.login(input);

    context.res.cookie(
      'refresh_token',
      result.refreshToken,
      getRefreshCookieOptions(),
    );

    return {
      accessToken: result.accessToken,
    };
  }

  // ============================================================
  // REFRESH
  // ============================================================

  @Mutation(() => GatewayLoginResponse)
  async refreshToken(
    @Context() context: any,
  ) {
    const refreshToken =context.req.cookies?.refresh_token;

    console.log('[Gateway] refresh cookie:', !!refreshToken);
    if (!refreshToken) {
      throw new Error('Refresh token không tồn tại');
    }

    const result = await this.authGatewayService.refreshToken(refreshToken);

    context.res.cookie(
      'refresh_token',
      result.refreshToken,
      getRefreshCookieOptions(),
    );

    return {
      accessToken: result.accessToken,
    };
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  @Mutation(() => Boolean)
  async logout(
    @Context() context: any,
  ) {
    const refreshToken =
      context.req.cookies?.refresh_token;

    if (refreshToken) {
      await this.authGatewayService.logout(
        refreshToken,
        context.req?.headers?.authorization,
      );
    }

    context.res.clearCookie(
      'refresh_token',
      getRefreshCookieOptions(),
    );

    return true;
  }

  // ============================================================
  // LOGOUT ALL
  // ============================================================

  @Mutation(() => Boolean)
  async logoutAll(
    @Context() context: any,
  ) {
    await this.authGatewayService.logoutAll(
      context.req?.headers?.authorization,
    );

    context.res.clearCookie(
      'refresh_token',
      getRefreshCookieOptions(),
    );

    return true;
  }

  // ============================================================
  // FORGOT PASSWORD
  // ============================================================

  @Mutation(() => String)
  forgotPassword(
    @Args('input') input: GatewayForgotPasswordInput,
  ) {
    return this.authGatewayService.forgotPassword(input);
  }

  // ============================================================
  // RESET PASSWORD
  // ============================================================

  @Mutation(() => String)
  resetPassword(
    @Args('input') input: GatewayResetPasswordInput,
  ) {
    return this.authGatewayService.resetPassword(input);
  }

  // ============================================================
  // VERIFY EMAIL
  // ============================================================

  @Mutation(() => Boolean)
  verifyEmail(
    @Args('token') token: string,
  ) {
    return this.authGatewayService.verifyEmail(token);
  }

  // ============================================================
  // RESEND VERIFY EMAIL
  // ============================================================

  @Mutation(() => Boolean)
  resendVerifyEmail(
    @Args('email') email: string,
  ) {
    return this.authGatewayService.resendVerifyEmail(email);
  }

  // ============================================================
  // OAUTH
  // ============================================================

// async oauthLogin(
//   input: any,
//   authorization?: string,
// ) {
//   const result = await this.execute<{
//     oauthLogin: {
//       accessToken: string;
//       refreshToken: string;
//     };
//   }>(
//     `
//     mutation OauthLogin($input: OauthLoginInput!) {
//       oauthLogin(input: $input) {
//         accessToken
//         refreshToken
//       }
//     }
//     `,
//     {
//       input,
//     },
//     authorization,
//   );

//   return result.oauthLogin;
// }

  // ============================================================
  // PROFILE
  // ============================================================

  @Query(() => String)
  getMyProfile(
    @Context() context: any,
  ) {
    return this.authGatewayService.getMyProfile(
      context.req?.headers?.authorization,
    );
  }

  // ============================================================
  // CHANGE PASSWORD
  // ============================================================

  @Mutation(() => Boolean)
  changePassword(
    @Args('input') input: GatewayChangePasswordInput,
    @Context() context: any,
  ) {
    return this.authGatewayService.changePassword(
      input,
      context.req?.headers?.authorization,
    );
  }

  // ============================================================
  // ACTIVE SESSIONS
  // ============================================================

  @Query(() => [GatewayLoginSession])
  getActiveSessions(
    @Context() context: any,
  ) {
    return this.authGatewayService.getActiveSessions(
      context.req?.headers?.authorization,
    );
  }

  // ============================================================
  // TERMINATE SESSION
  // ============================================================

  @Mutation(() => Boolean)
  terminateSession(
    @Args('sessionId', { type: () => ID })
    sessionId: string,

    @Context() context: any,
  ) {
    return this.authGatewayService.terminateSession(
      sessionId,
      context.req?.headers?.authorization,
    );
  }
}