import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { AdminResolver } from './admin.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AdminResolver, AdminService, AdminRepository],
  exports: [AdminService],
})
export class AdminModule {}