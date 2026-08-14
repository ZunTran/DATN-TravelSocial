import { Injectable } from '@nestjs/common';
import { Prisma, notification_type } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(data: Prisma.notificationCreateInput,
    tx?: Prisma.TransactionClient,) {

    const client = tx ?? this.prisma;
    return client.notification.create({data});
}

  async findById(id: string) {
    return this.prisma.notification.findUnique({where: { id },});
  }

  async findByUser(userId: string,page: number,limit: number) {
    const skip = (page - 1) * limit;

    const where = {receiver_id: userId};

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: {created_at: 'desc'},
        skip,
        take: limit,
      }),

      this.prisma.notification.count({where}),
    ]);

    return {
      data,total,
      page,limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {id,receiver_id: userId,},
      data: {is_read: true},
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {receiver_id: userId,is_read: false},
      data: {is_read: true},
    });
  }
}