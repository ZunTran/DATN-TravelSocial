import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
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

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async register(@Args('input') input: RegisterInput) {
    const res = await this.authService.register(input);
    return JSON.stringify(res);
  }

  // @Mutation(() => String)
  // async login(@Args('input') input: LoginInput) {
  //   const res = await this.authService.login(input);
  //   return JSON.stringify(res);
  // }

  @Mutation(() => LoginResponse)
  async login(@Args('input') input: LoginInput): Promise<LoginResponse> {
    return this.authService.login(input);
  }

  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@CurrentUser() user: any) {
    return `Xin chào user ID: ${user.userId} (${user.email})`;
  }

  // @Query(() => String)
  // hello(): string {
  //   return 'Hello from Auth Service';
  // }

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
}
