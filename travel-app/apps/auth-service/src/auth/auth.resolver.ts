import { Resolver, Mutation, Args, Query,Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ForgotPasswordInput } from './dto/forgot-pass.input';
import { ResetPasswordInput } from './dto/reset-pass.input';
import { LoginResponse } from './dto/login.response';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { ChangePasswordInput } from './dto/change-pass.input';
import { OauthLoginInput } from './dto/oauth.input';
import { LoginSession } from './dto/login-session.object';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
async register(
  @Args('input') input: RegisterInput,
  @Context() context: any,
): Promise<LoginResponse> {
  const req = context.req;

  const meta = {
    ipAddress:
      req?.ip ||
      req?.connection?.remoteAddress ||
      '127.0.0.1',

    deviceName:
      req?.headers['user-agent'] ||
      'Unknown Device',
  };

  return this.authService.register(
    input,
    meta,
  );
}


  @Mutation(() => LoginResponse)
  async login(@Args('input') input: LoginInput,@Context() context: any): Promise<LoginResponse> {
    const req = context.req;
    
    const meta = {
      ipAddress: req?.ip || req?.connection?.remoteAddress || '127.0.0.1',
      deviceName: req?.headers['user-agent'] || 'Unknown Device',
    };
    return this.authService.login(input,meta);
  }



  @Mutation(() => Boolean)
  async forgotPassword(@Args('input') input: ForgotPasswordInput): Promise<boolean> {
    return this.authService.forgetPassword(input);
  }

  @Mutation(() => Boolean)
  async resetPassword(@Args('input') input: ResetPasswordInput): Promise<boolean> {
    return this.authService.resetPassword(input);
  }

  @Mutation(() => LoginResponse)
  async refreshToken(@Args('input') input: RefreshTokenInput): Promise<LoginResponse> {
    return this.authService.refreshToken(input);
  }

    
  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@CurrentUser() user: any) {
    return `Xin chào user ID: ${user.userId} (${user.email})`;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async logout(@Args('refreshToken') refreshToken: string): Promise<boolean> {
    return this.authService.logout(refreshToken);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async logoutAll(@CurrentUser() user: any): Promise<boolean> {
    return this.authService.logoutAll(user.userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: any,
    @Args('input') input: ChangePasswordInput,
  ): Promise<boolean> {
    return this.authService.changePassword(user.userId, input);
  }

  @Mutation(() => Boolean)
  async verifyEmail(@Args('token') token: string): Promise<boolean> {
    return this.authService.verifyEmail(token);
  }

  @Mutation(() => Boolean)
  async resendVerifyEmail(@Args('email') email: string): Promise<boolean> {
    return this.authService.resendVerifyEmail(email);
  }

  @Query(() => [LoginSession])
  @UseGuards(JwtAuthGuard)
  async getActiveSessions(@CurrentUser() user: any) {
    return this.authService.getActiveSessions(user.userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async terminateSession(
    @CurrentUser() user: any,
    @Args('sessionId') sessionId: string,
  ): Promise<boolean> {
    return this.authService.terminateSession(sessionId, user.userId);
  }

  @Mutation(() => LoginResponse)
  async oauthLogin(@Args('input') input: OauthLoginInput,@Context() context: any): Promise<LoginResponse> {
    const req = context.req;
    
    const meta = {
      ipAddress: req?.ip || req?.connection?.remoteAddress || '127.0.0.1',
      deviceName: req?.headers['user-agent'] || 'OAuth Device',
    };
    return this.authService.oauthLogin(input,meta);
  }


}
