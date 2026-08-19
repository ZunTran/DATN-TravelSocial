import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ActiveUserData } from '../interfaces/user-data.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'GRADUATION_SUPER_SECRET_KEY',
    });
  }

  async validate(payload: JwtPayload): Promise<ActiveUserData> {
    if (payload.type !== 'ACCESS') {
      throw new UnauthorizedException('Token không hợp lệ!');
    }
    
    return {
      accountId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}