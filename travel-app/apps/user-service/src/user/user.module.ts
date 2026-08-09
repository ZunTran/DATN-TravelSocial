import { Module } from '@nestjs/common';

import { UserProfileModule } from './user-profile/user-profile.module';
// import { InterestTagModule } from './interest-tag/interest-tag.module';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../common/auth/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserProfileModule,
    // InterestTagModule,
    CloudinaryModule,
  ],
  providers: [
    JwtStrategy, // 👈 Phải đưa JwtStrategy vào đây thì Passport mới biết strategy "jwt" là gì!
  ],
  
})
export class UserModule {}