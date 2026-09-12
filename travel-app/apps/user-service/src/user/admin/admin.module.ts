import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { AdminResolver } from './admin.resolver';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdminAccountRepository } from './admin-account.repository';

@Module({
  imports: [PrismaModule],
  providers: [AdminResolver, AdminService, AdminRepository,AdminAccountRepository],
  exports: [AdminService],
})
export class AdminModule {}