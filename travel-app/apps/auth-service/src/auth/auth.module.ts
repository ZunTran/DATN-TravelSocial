import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AccountRepository } from './repository/account.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from '../common/strategies/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'GRADUATION_SUPER_SECRET_KEY',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, AuthResolver, AccountRepository, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}