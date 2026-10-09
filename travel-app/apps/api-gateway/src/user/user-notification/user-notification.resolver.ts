import {
  Args,
  Context,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { NotificationService } from './user-notification.service';

import { GatewayNotificationPage } from './types/notification.type';
import { getAuthorization } from '../common/auth/gateway-auth.util';


@Resolver()
export class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Query(() => GatewayNotificationPage)
  notifications(
    @Args('page', {
      type: () => Int,
      defaultValue: 1,
    })
    page: number,

    @Args('limit', {
      type: () => Int,
      defaultValue: 10,
    })
    limit: number,

    @Context() context: any,
  ) {
    return this.notificationService.notifications(
      page,
      limit,
      getAuthorization(context),
    );
  }

  @Mutation(() => Boolean)
  markNotificationAsRead(
    @Args('notificationId', {
      type: () => ID,
    })
    notificationId: string,

    @Context() context: any,
  ) {
    return this.notificationService.markAsRead(
      notificationId,
      getAuthorization(context),
    );
  }

  @Mutation(() => Boolean)
  markAllNotificationsAsRead(
    @Context() context: any,
  ) {
    return this.notificationService.markAllAsRead(
      getAuthorization(context),
    );
  }
}