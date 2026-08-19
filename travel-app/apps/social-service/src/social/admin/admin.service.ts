import * as bcrypt from 'bcrypt';
import { Injectable, ConflictException } from '@nestjs/common';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async seedDefaultAdmin() {
    const email = 'admin@travelsocial.com';
    const rawPassword = 'AdminPassword123@';

    const existing = await this.adminRepository.findAccountByEmail(email);
    if (existing) throw new ConflictException('Tài khoản Admin đã tồn tại trong hệ thống!');
    

    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const result = await this.adminRepository.createAdminWithProfile(email, passwordHash);

    return {
      message: 'Khởi tạo tài khoản Admin thành công!',
      email: result.newAccount.email,
      username: result.newProfile.username,
    };
  }
}