import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { USER_REGISTERED_EVENT } from './event.constants';
import type { UserRegisteredEvent } from './event.constants';
import { UserProfileService } from '../../user/user-profile/user-profile.service';

@Controller()
export class UserRegisteredConsumer {
  private readonly logger =
    new Logger(
      UserRegisteredConsumer.name,
    );

  constructor(
    private readonly userProfileService:
      UserProfileService,
  ) {}

  @EventPattern(USER_REGISTERED_EVENT)
  async handleUserRegistered(
    @Payload()
    event: UserRegisteredEvent): Promise<void> {
    this.logger.log(`UserRegistered received: ${event.accountId}`);

    await this.userProfileService
      .createDefaultProfile(
        event.accountId,
        event.email,
      );
  }
}