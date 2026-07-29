import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountRepository } from './repository/account.repository';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterInput) {
    const { email, password } = input;
    const existing = await this.accountRepository.findByEmail(email);
    if (existing) {
      throw new BadRequestException('Email này đã tồn tại trong hệ thống!');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAccount = await this.accountRepository.createAccount({
      email,
      passwordHash,
    });

    return {
      message: 'Đăng ký tài khoản thành công!',
      account: newAccount,
    };
  }

  async login(input: LoginInput) {
    const { email, password } = input;
    const account = await this.accountRepository.findByEmail(email);
    if (!account) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    const isMatch = await bcrypt.compare(password, account.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    const payload = { sub: account.id, email: account.email, role: account.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      account,
    };
  }
}