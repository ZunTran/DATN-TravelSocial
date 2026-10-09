import { forwardRef, Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { NotificationRepository } from "./notification.repository";
import { UserProfileModule } from "../user-profile/user-profile.module";
import { FollowModule } from "../follow/follow.module";
import { NotificationService } from "./notification.service";
import { NotificationResolver } from "./notification.resolver";

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UserProfileModule),
    forwardRef(() => FollowModule,),
  ],
  providers: [
    NotificationRepository,
    NotificationService,
    NotificationResolver,
  ],

  exports: [
    NotificationRepository,
    NotificationService,
  ],
})
export class NotificationModule {}