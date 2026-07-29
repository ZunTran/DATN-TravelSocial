import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'GRADUATION_SUPER_SECRET_KEY',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    // Kiểm tra xem account còn tồn tại và active không
    const account = await this.prisma.account.findUnique({
      where: { id: payload.sub },
    });

    if (!account || account.status === 'BANNED' || account.status === 'LOCKED') {
      throw new UnauthorizedException('Tài khoản không tồn tại hoặc đã bị khóa!');
    }

    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}