import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotificationObject } from './objects/notification.object';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/auth/decorators/current-user.decorator';
import type { ActiveUserData } from '../../common/auth/interfaces/user-data.interface';
import { NotificationPageObject } from './objects/notification-page.object';

@Resolver(() => NotificationObject)
export class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

@Query(() => NotificationPageObject)
  @UseGuards(JwtAuthGuard)
  notifications(
    @CurrentUser() user: ActiveUserData,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number) {
    return this.notificationService.findByUser(
      user.accountId,
      page,
      limit,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  markNotificationAsRead(
    @CurrentUser() user: ActiveUserData,
    @Args('notificationId', { type: () => ID })
    notificationId: string ) {
    return this.notificationService.markAsRead( user.accountId, notificationId );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  markAllNotificationsAsRead(
    @CurrentUser()
    user: ActiveUserData) {
    return this.notificationService.markAllAsRead( user.accountId );
  }
}