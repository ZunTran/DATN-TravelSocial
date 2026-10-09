import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import {
  notification_type,
} from '@prisma/client';

registerEnumType(
  notification_type,
  {
    name: 'NotificationType',
  },
);

@ObjectType()
export class NotificationObject {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  receiverId!: string;

  @Field(() => ID, {
    nullable: true,
  })
  senderId?: string | null;

  @Field(
    () => notification_type,
  )
  type!: notification_type;

  @Field(() => String)
  message!: string;

  @Field(() => String, {
    nullable: true,
  })
  postId?: string | null;

  @Field(() => Boolean)
  isRead!: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}