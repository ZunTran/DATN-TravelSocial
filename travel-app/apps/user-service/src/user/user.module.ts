import { Module } from '@nestjs/common';
import { UserService } from './user-profile/user-profile.service';
import { UserResolver } from './user-profile/user-profile.resolver';

import { PrismaModule } from '../prisma/prisma.module';
import { UserProfileRepository } from './user-profile/user-profile.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    UserProfileRepository,
    UserService,
    UserResolver,
  ],
//   exports: [UserService], // Export UserService nếu sau này các service khác cần gọi nội bbộ?
})
export class UserModule {}