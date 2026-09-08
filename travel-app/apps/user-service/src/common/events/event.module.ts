import { Module } from '@nestjs/common';
import { UserRegisteredConsumer } from './user-registered.consumer';
import { UserProfileModule } from '../../user/user-profile/user-profile.module';

@Module({
  imports: [
    UserProfileModule,
  ],

  controllers: [
    UserRegisteredConsumer,
  ],
})
export class EventsModule {}