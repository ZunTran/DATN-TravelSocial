import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AccountRepository } from './repository/account.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { OauthRepository } from './repository/oauth.repository';
import { LoginSessionRepository } from './repository/login-session.repository';
import { PasswordResetRepository } from './repository/password-reset.repository';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { AuthTransactionRepository } from './repository/auth-transaction.repository';
import { EventsModule } from '../common/events/event.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'GRADUATION_SUPER_SECRET_KEY',
      signOptions: { expiresIn: '1d' },
    }),
    EventsModule,
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    AccountRepository,
    RefreshTokenRepository,
    PasswordResetRepository,
    LoginSessionRepository,
    OauthRepository,
    AuthTransactionRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}