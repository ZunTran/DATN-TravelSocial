import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { NotificationRepository } from "./notification.repository";

@Module({
  imports: [PrismaModule],
  providers: [NotificationRepository],
  exports: [NotificationRepository],
})
export class NotificationModule {}