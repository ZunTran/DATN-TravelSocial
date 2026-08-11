import { Module } from '@nestjs/common';

import { UserProfileModule } from './user-profile/user-profile.module';
// import { InterestTagModule } from './interest-tag/interest-tag.module';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../common/auth/strategies/jwt.strategy';
import { AdminModule } from './admin/admin.module';
import { InterestTagModule } from './interest/interest-tag.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserProfileModule,
    AdminModule,
    InterestTagModule,
    CloudinaryModule,
  ],
  providers: [
    JwtStrategy, 
  ],
  
})
export class UserModule {}