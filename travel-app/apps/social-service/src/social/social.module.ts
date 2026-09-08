import { Module } from '@nestjs/common';
// import { InterestTagModule } from './interest-tag/interest-tag.module';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../common/auth/strategies/jwt.strategy';
import { AdminModule } from './admin/admin.module';
import { UserProfileClientModule } from '../common/clients/user-profile/user-profile.module';
import { PostModule } from './post/post.module';
import { MetadataModule } from './metadata/metadata.module';
import { InteractionModule } from './interaction/interaction.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserProfileClientModule,
    AdminModule,
    CloudinaryModule,
    PostModule,
    MetadataModule,
    InteractionModule
  ],
  providers: [
    JwtStrategy, 
  ],
  
})
export class SocialModule {}