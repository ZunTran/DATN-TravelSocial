import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../common/auth/strategies/jwt.strategy';
import { UserProfileClientModule } from '../common/clients/user-profile/user-profile.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserProfileClientModule,
    CloudinaryModule,
  ],
  providers: [
    JwtStrategy, 
  ],
  
})
export class AIlModule {}