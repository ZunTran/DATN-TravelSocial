import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum GatewayNotificationType {
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  POST_LIKED = 'POST_LIKED',
  POST_COMMENTED = 'POST_COMMENTED',
  NEW_POST = 'NEW_POST',
}

registerEnumType(GatewayNotificationType, {
  name: 'GatewayNotificationType',
});

@ObjectType()
export class GatewayNotification {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  receiverId!: string;

  @Field(() => ID, { nullable: true })
  senderId?: string | null;

  @Field(() => GatewayNotificationType)
  type!: GatewayNotificationType;

  @Field()
  message!: string;

  @Field(() => ID, { nullable: true })
  postId?: string | null;

  @Field()
  isRead!: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}

@ObjectType()
export class GatewayNotificationPage {
  @Field(() => [GatewayNotification])
  data!: GatewayNotification[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;
}