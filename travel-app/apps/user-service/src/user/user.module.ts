import { Module } from '@nestjs/common';
import { UserProfileModule } from './user-profile/user-profile.module';
// import { InterestTagModule } from './interest-tag/interest-tag.module';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../common/auth/strategies/jwt.strategy';
import { AdminModule } from './admin/admin.module';
import { InterestTagModule } from './interest/interest-tag.module';
import { FollowModule } from './follow/follow.module';
import { BlockModule } from './block/block.module';
import { NotificationModule } from './notification/notification.module';
import { UserReportModule } from './user-report/user-report.module';
import { UserRegisteredConsumer } from '../common/events/user-registered.consumer';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserProfileModule,
    AdminModule,
    InterestTagModule,
    CloudinaryModule,
    FollowModule,
    BlockModule,
    NotificationModule,
    UserReportModule

  ],
  controllers: [
    UserRegisteredConsumer,
  ],
  providers: [
    JwtStrategy, 
  ],
  
})
export class UserModule {}