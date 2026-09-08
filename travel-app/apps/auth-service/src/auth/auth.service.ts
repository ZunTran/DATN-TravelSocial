import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AccountStatus, Account } from '@prisma/client';
import { JwtType } from './enums/jwt-type.enum';
import { AccountRepository } from './repository/account.repository';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { PasswordResetRepository } from './repository/password-reset.repository';
import { LoginSessionRepository } from './repository/login-session.repository';
import { AuthTransactionRepository } from './repository/auth-transaction.repository';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { ForgotPasswordInput } from './dto/forgot-pass.input';
import { ResetPasswordInput } from './dto/reset-pass.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { ChangePasswordInput } from './dto/change-pass.input';
import { OauthLoginInput } from './dto/oauth.input';
import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE_MS, RESET_TOKEN_EXPIRE_MS, RESET_PASSWORD_INTERVAL_MINUTES } from './auth.constants';
import { EventsService } from '../common/events/event.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountRepo: AccountRepository,
    private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly passwordResetRepo: PasswordResetRepository,
    private readonly loginSessionRepo: LoginSessionRepository,
    private readonly authTransactionRepo: AuthTransactionRepository,
    private readonly jwtService: JwtService,
      private readonly eventsService: EventsService,

  ) {}

  private generateAccessToken(account: Account) {
    return this.jwtService.sign(
      {
        sub: account.id,
        email: account.email,
        role: account.role,
        tokenVersion: account.tokenVersion,
        type: JwtType.ACCESS,
      },
      { expiresIn: ACCESS_TOKEN_EXPIRE }
    );
  }

  private checkAccountStatus(account: Account) {
    if (account.status === AccountStatus.BANNED) 
      throw new ForbiddenException('Tài khoản đã bị cấm (banned)!');
    if (account.status === AccountStatus.LOCKED) 
      throw new ForbiddenException('Tài khoản đang bị khóa!');
  }

  async register(input: RegisterInput,
    meta?: {
    deviceName?: string;
    ipAddress?: string;
  },
  ) {
    const { email, password } = input;
    const existing = await this.accountRepo.findByEmail(email);
    if (existing) throw new BadRequestException('Email này đã tồn tại!');
    
    const passwordHash = await bcrypt.hash(password, 10);
    const account=await this.accountRepo.createAccount({ email, passwordHash });

    this.eventsService.publishUserRegistered({
      accountId: account.id,
      email: account.email
    });

    const refreshTokenRaw = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash =crypto.createHash('sha256').update(refreshTokenRaw).digest('hex');

    console.log(
  '[AUTH REGISTER] generated token:',
  refreshTokenRaw.slice(0, 10),
  'length:',
  refreshTokenRaw.length,
);

console.log(
  '[AUTH REGISTER] hash:',
  refreshTokenHash,
);


    const expiredAt =new Date(Date.now() +REFRESH_TOKEN_EXPIRE_MS);

    await this.authTransactionRepo.loginTransaction(
      account.id,
      refreshTokenHash,
      expiredAt,
      meta?.deviceName,
      meta?.ipAddress,
    );

    const accessToken = this.generateAccessToken(account);

    return {
      accessToken,
      refreshToken: refreshTokenRaw,
    };
  }

  async login(input: LoginInput, meta?: { deviceName?: string; ipAddress?: string }) {
    const { email, password } = input;
    const account = await this.accountRepo.findByEmail(email);
    if (!account || !account.passwordHash) throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    
    const isMatch = await bcrypt.compare(password, account.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');

    this.checkAccountStatus(account);

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiredAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRE_MS);


    console.log( '[AUTH LOGIN] refresh token:', refreshToken.slice(0, 10));

  console.log('[AUTH LOGIN] refresh hash:', refreshTokenHash.slice(0, 10),);

    await this.authTransactionRepo.loginTransaction(
      account.id, 
      refreshTokenHash, 
      expiredAt, 
      meta?.deviceName, 
      meta?.ipAddress
    );

    console.log('[AUTH LOGIN] refresh token saved',
  );

    const accessToken = this.generateAccessToken(account);

    console.log('[AUTH LOGIN] access token expires:',ACCESS_TOKEN_EXPIRE);

    return { accessToken, refreshToken };
  }

  async forgetPassword(input: ForgotPasswordInput): Promise<boolean> {
    const { email } = input;
    const account = await this.accountRepo.findByEmail(email);
    if (!account) throw new BadRequestException('Email không tồn tại!');
    
    const recentToken = await this.passwordResetRepo.findRecentTokenByAccount(account.id);
    if (recentToken) {
      const diffMinutes = (Date.now() - new Date(recentToken.createdAt).getTime()) / 1000 / 60;
      if (diffMinutes < RESET_PASSWORD_INTERVAL_MINUTES) {
        throw new BadRequestException(`Vui lòng đợi ${RESET_PASSWORD_INTERVAL_MINUTES} phút trước khi yêu cầu gửi lại mã mới!`);
      }
    }
    
    await this.passwordResetRepo.invalidateOldTokens(account.id);
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const expiredAt = new Date(Date.now() + RESET_TOKEN_EXPIRE_MS);

    await this.passwordResetRepo.createResetToken(account.id, hashedToken, expiredAt);
    console.log(`[DEV ONLY] Reset Password Token cho ${email}: ${token}`);

    return true;
  }

  async resetPassword(input: ResetPasswordInput): Promise<boolean> {
    const { token, password } = input;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await this.passwordResetRepo.findValidToken(hashedToken);
    if (!resetToken) throw new BadRequestException('Token đặt lại mật khẩu không hợp lệ hoặc hết hạn!');

    const passwordHash = await bcrypt.hash(password, 10);
    await this.authTransactionRepo.resetPasswordTransaction(resetToken.accountId, passwordHash, resetToken.id);

    return true;
  }

  async refreshToken(input: RefreshTokenInput) {
    const { refreshToken } = input;

    console.log(
    '[AUTH REFRESH] received:',
    refreshToken?.slice(0, 10),
  );

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    console.log('[AUTH REFRESH] hash:',tokenHash);

    const newRefreshToken = crypto.randomBytes(40).toString('hex');
    const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

     console.log(
    '[AUTH REFRESH] new token:',
    newRefreshToken.slice(0, 10),
  );

    const expiredAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRE_MS);

    const account = await this.authTransactionRepo.rotateRefreshTokenTransaction(tokenHash, newRefreshTokenHash, expiredAt);
    
    console.log(  '[AUTH REFRESH] rotation successful');
    const accessToken = this.generateAccessToken(account);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string): Promise<boolean> {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.authTransactionRepo.logoutTransaction(tokenHash);
    return true;
  }

  async logoutAll(accountId: string): Promise<boolean> {
    await this.authTransactionRepo.logoutAllTransaction(accountId);
    return true;
  }

  async changePassword(accountId: string, input: ChangePasswordInput): Promise<boolean> {
    const { oldPassword, newPassword } = input;
    const account = await this.accountRepo.findById(accountId);
    if (!account) throw new BadRequestException('Tài khoản không tồn tại!');
    
    if (!account.passwordHash) {
      throw new BadRequestException('Tài khoản đăng nhập bằng mạng xã hội không hỗ trợ đổi mật khẩu!');
    }

    const isMatch = await bcrypt.compare(oldPassword, account.passwordHash);
    if (!isMatch) throw new BadRequestException('Mật khẩu cũ không chính xác!');

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.authTransactionRepo.changePasswordTransaction(accountId, passwordHash);

    return true;
  }

  async verifyEmail(token: string): Promise<boolean> {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.type !== JwtType.VERIFY_EMAIL) throw new BadRequestException('Token xác thực email không hợp lệ!');

      await this.accountRepo.markEmailVerified(payload.sub);
      return true;
    } catch {
      throw new BadRequestException('Link xác thực không hợp lệ hoặc đã hết hạn!');
    }
  }

  async resendVerifyEmail(email: string): Promise<boolean> {
    const account = await this.accountRepo.findByEmail(email);
    if (!account) throw new BadRequestException('Email ko khả dụng');

    const verifyToken = this.jwtService.sign({ 
      sub: account.id, 
      email,
      type: JwtType.VERIFY_EMAIL, 
    }, { expiresIn: '1d' });
    console.log(`[DEV ONLY] Link Verify Email cho ${email}: https://app.com/verify?token=${verifyToken}`);
    return true;
  }

  async getActiveSessions(accountId: string) {
    return this.loginSessionRepo.getActiveSessions(accountId);
  }

  async terminateSession(sessionId: string, accountId: string): Promise<boolean> {
    await this.loginSessionRepo.terminateSession(sessionId, accountId);
    return true;
  }

  async oauthLogin(input: OauthLoginInput, meta?: { deviceName?: string; ipAddress?: string }) {
    const { provider, providerUserId, email } = input;

    const refreshTokenRaw = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(refreshTokenRaw).digest('hex');
    const expiredAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRE_MS);

    const account = await this.authTransactionRepo.oauthLoginTransaction(
      email, 
      provider, 
      providerUserId, 
      refreshTokenHash, 
      expiredAt, 
      meta?.deviceName, 
      meta?.ipAddress
    );

    this.checkAccountStatus(account);
    const accessToken = this.generateAccessToken(account);
    return { accessToken, refreshToken: refreshTokenRaw };
  }
}
