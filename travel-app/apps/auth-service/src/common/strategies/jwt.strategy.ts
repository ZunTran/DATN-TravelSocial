import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccountRepository } from '../../auth/repository/account.repository';
import { JwtType } from '../../auth/enums/jwt-type.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
     private readonly accountRepository: AccountRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'GRADUATION_SUPER_SECRET_KEY',
    });
  }

  async validate(payload: { sub: string; email: string; role: string; tokenVersion: number; sessionId?: string ; type: JwtType}) {
    if (payload.type !== JwtType.ACCESS) 
      throw new UnauthorizedException('Access token không hợp lệ!');
 
    const account = await this.accountRepository.findById(payload.sub);

    if (!account || account.status === 'BANNED' || account.status === 'LOCKED') 
      throw new UnauthorizedException('Tài khoản không tồn tại hoặc đã bị khóa!');
    
    if (account.tokenVersion !== payload.tokenVersion)
      throw new UnauthorizedException('Phiên đăng nhập đã hết hiệu lực do có thay đổi bảo mật!');

    return { 
      userId: account.id,
      email: account.email,
      role: account.role,
      sessionId: payload.sessionId 
    };
  }
}