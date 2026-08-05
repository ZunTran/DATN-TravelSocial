import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AccountRepository } from './repository/account.repository';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { ForgotPasswordInput } from './dto/forgot-pass.input';
import { ResetPasswordInput } from './dto/reset-pass.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { ChangePasswordInput } from './dto/change-pass.input';
import { OauthLoginInput } from './dto/oauth.input';
import { log } from 'console';
import { AccountStatus } from '@prisma/client';


@Injectable()
export class AuthService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterInput) {
    const { email, password } = input;
    const existing = await this.accountRepository.findByEmail(email);
    if (existing) throw new BadRequestException('Email này đã tồn tại!');
    
    const passwordHash = await bcrypt.hash(password, 10);
    await this.accountRepository.createAccount({email,passwordHash,});

    return {
      message: 'Đăng ký tài khoản thành công! Hãy đăng nhập để tiếp tục.',
    };
  }

  async login(input: LoginInput) {
    const { email, password } = input;
    const account = await this.accountRepository.findByEmail(email);
    if (!account) throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    
    const isMatch = await bcrypt.compare(password, account.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');

    if (account.status === AccountStatus.BANNED)
    throw new ForbiddenException("Account has been banned");

    if (account.status === AccountStatus.LOCKED)
    throw new ForbiddenException("Account is locked");

    await this.accountRepository.updateLastLogin(account.id);
    const payload = { 
      sub: account.id, 
      email: account.email, 
      role: account.role,
      tokenVersion: account.tokenVersion
    };
    const accessToken = this.jwtService.sign(payload,{ expiresIn: '15m'});

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    await this.accountRepository.createRefreshToken(account.id, refreshTokenHash, expiredAt);

    return {
      accessToken,
      refreshToken,
    };
  }

  async forgetPassword(input: ForgotPasswordInput):Promise<boolean> {
    const { email } = input;
    const account = await this.accountRepository.findByEmail(email);
    if (!account) throw new BadRequestException('Email không tồn tại!');
    
    const recentToken = await this.accountRepository.findRecentTokenByAccount(account.id);
    if (recentToken) {
      const diffMinutes = (Date.now() - new Date(recentToken.createdAt).getTime()) / 1000 / 60;
      if (diffMinutes < 2) {
        throw new BadRequestException('Vui lòng đợi 2 phút trước khi yêu cầu gửi lại mã mới!');
      }
    }
    await this.accountRepository.invalidateOldTokens(account.id);
    const token= crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const expiredAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.accountRepository.createResetToken(account.id, hashedToken, expiredAt);
    console.log(`[DEV ONLY] Reset Password Token cho ${email}: ${token}`);

    return true;
  }

  async resetPassword(input: ResetPasswordInput): Promise<boolean> {
    const { token, password } = input;
    const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

    const resetToken = await this.accountRepository.findValidToken(hashedToken);
    if (!resetToken) {
      throw new BadRequestException('Token đặt lại mật khẩu không hợp lệ hoặc hết hạn!');
    }

    const passwordHash = await bcrypt.hash(password,10);
    await this.accountRepository.updatePassword(resetToken.accountId, passwordHash);
    await this.accountRepository.markTokenAsUsed(resetToken.id);

    return true;
  }

  async refreshToken(input: RefreshTokenInput) {
    const { refreshToken } = input;
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // const token = await this.accountRepository.findRefreshToken(tokenHash);
    // if (!token) 
    //   throw new UnauthorizedException('Refresh token không hợp lệ hoặc hết hạn!');
    
    // const account = token.account;
    // await this.accountRepository.revokeRefreshToken(tokenHash);

    // const payload = { sub: account.id, email: account.email, role: account.role };
    // const newAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    const newRefreshToken = crypto.randomBytes(40).toString('hex');
    const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const account =await this.accountRepository.rotateRefreshToken(tokenHash,newRefreshTokenHash,expiredAt);
    await this.accountRepository.createRefreshToken(account.id, newRefreshTokenHash, expiredAt);

     const payload = {
        sub: account.id,
        email: account.email,
        role: account.role,
        tokenVersion: account.tokenVersion,
    };

    const accessToken = this.jwtService.sign(payload, {expiresIn: '15m',});

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string): Promise<boolean> {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.accountRepository.revokeRefreshToken(tokenHash);
    return true;
  }

  async logoutAll(accountId: string): Promise<boolean> {
    await this.accountRepository.logoutAllDevices(accountId);
    await this.accountRepository.increaseTokenVersion(accountId);
    return true;
  }

  async changePassword(accountId: string, input: ChangePasswordInput): Promise<boolean> {
    const { oldPassword, newPassword } = input;
    const account = await this.accountRepository.findById(accountId);
    if(!account) throw new BadRequestException('Tài khoản không tồn tại!');
    
    const isMatch = await bcrypt.compare(oldPassword, account.passwordHash);
    if (!isMatch) throw new BadRequestException('Mật khẩu cũ không chính xác!');

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.accountRepository.changePasswordTransaction(accountId,passwordHash);

    return true;
  }

  //  Verify Email 
  async verifyEmail(token: string): Promise<boolean> {
    try {
      const payload = this.jwtService.verify(token);
      await this.accountRepository.markEmailVerified(payload.sub);
      return true;
    } catch {
      throw new BadRequestException('Link xác thực không hợp lệ hoặc đã hết hạn!');
    }
  }

  async resendVerifyEmail(email: string): Promise<boolean> {
    const account = await this.accountRepository.findByEmail(email);
    if (!account) throw new BadRequestException('Email ko khả dụng');

    const verifyToken = this.jwtService.sign({ sub: account.id, email }, { expiresIn: '1d' });
    console.log(`[DEV ONLY] Link Verify Email cho ${email}: https://app.com/verify?token=${verifyToken}`);
    return true;
  }

  //  Session Management
  async getActiveSessions(accountId: string) {
    return this.accountRepository.getActiveSessions(accountId);
  }

  async terminateSession(sessionId: string, accountId: string): Promise<boolean> {
    await this.accountRepository.terminateSession(sessionId, accountId);
    return true;
  }

  //  OAuth Login
  async oauthLogin(input: OauthLoginInput) {
    const { provider, providerUserId, email } = input;

    let oauthRecord = await this.accountRepository.findOauthAccount(provider, providerUserId);
    let account;

    if (oauthRecord) {
      account = oauthRecord.account;
    } else {
      account = await this.accountRepository.findByEmail(email);
      if (account) {
        await this.accountRepository.createOauthAccount(account.id, provider, providerUserId);
      } else {
        // Chưa có tài khoản nào -> Tạo mới account kèm OAuth
        account = await this.accountRepository.createAccountWithOauth(email, provider, providerUserId);
      }
    }

    const payload = { sub: account.id, email: account.email, role: account.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    const refreshTokenRaw = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(refreshTokenRaw).digest('hex');
    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.accountRepository.createRefreshToken(account.id, refreshTokenHash, expiredAt);

    return {
      accessToken,
      refreshToken: refreshTokenRaw,
    };
  }
}