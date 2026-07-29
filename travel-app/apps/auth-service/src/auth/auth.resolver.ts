import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async register(@Args('input') input: RegisterInput) {
    const res = await this.authService.register(input);
    return JSON.stringify(res);
  }

  @Mutation(() => String)
  async login(@Args('input') input: LoginInput) {
    const res = await this.authService.login(input);
    return JSON.stringify(res);
  }

  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@CurrentUser() user: any) {
    return `Xin chào user ID: ${user.userId} (${user.email})`;
  }
}