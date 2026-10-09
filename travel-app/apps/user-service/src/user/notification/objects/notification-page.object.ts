import {
  Field,
  Int,
  ObjectType,
} from '@nestjs/graphql';

import {
  NotificationObject,
} from './notification.object';

@ObjectType()
export class NotificationPageObject {
  @Field(() => [NotificationObject])
  data!: NotificationObject[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;
}