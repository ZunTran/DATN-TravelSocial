import { Injectable } from '@nestjs/common';
import {Prisma,user_report_status} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserReportRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findPendingByReporterAndUser(reporterId: string,reportedUserId: string,) {
    return this.prisma.user_report.findFirst({
      where: {
        reporter_id: reporterId,
        reported_user_id: reportedUserId,
        status: user_report_status.PENDING,
      }});
  }

  async create(reporterId: string,reportedUserId: string,reason: string,
    tx?: Prisma.TransactionClient) {
    return (tx ?? this.prisma).user_report.create({
      data: {
        reporter_id: reporterId,
        reported_user_id: reportedUserId,
        reason,
        status: user_report_status.PENDING,
      },
    });
  }

  async findMyReports(reporterId: string,page: number,limit: number) {
    const skip = (page - 1) * limit;
    const where = {reporter_id: reporterId,};

    const [data, total] = await Promise.all([
      this.prisma.user_report.findMany({
        where,
        orderBy: {created_at: 'desc'},
        skip,
        take: limit,
      }),

      this.prisma.user_report.count({where}),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    return this.prisma.user_report.findUnique({
      where: {id},

      include: {
        reporter: {
          select: {
            id: true,
            username: true,
            display_name: true,
            avatar_url: true,
            cover_url: true,
            bio: true,
            gender: true,
            birthday: true,
            location: true,
            privacy: true,
            created_at: true,
            updated_at: true,
          }},

        reported_user: {
          select: {
            id: true,
            username: true,
            display_name: true,
            avatar_url: true,
            cover_url: true,
            bio: true,
            gender: true,
            birthday: true,
            location: true,
            privacy: true,
            created_at: true,
            updated_at: true,
          }},
      },
    });
  }

  async findPaginated({page,limit,status,}: {
    page: number;limit: number;status?: user_report_status;}) {
    const where: Prisma.user_reportWhereInput = {...(status ? { status } : {}),};

    const [data, total] =await this.prisma.$transaction([
      this.prisma.user_report.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {created_at: 'desc'},

        include: {
          reporter: {
            select: {
              id: true,
              username: true,
              display_name: true,
              avatar_url: true,
              cover_url: true,
              bio: true,
              gender: true,
              birthday: true,
              location: true,
              privacy: true,
              created_at: true,
              updated_at: true,
              }},

            reported_user: {
              select: {
                id: true,
                username: true,
                display_name: true,
                avatar_url: true,
                cover_url: true,
                bio: true,
                gender: true,
                birthday: true,
                location: true,
                privacy: true,
                created_at: true,
                updated_at: true,
              }},
          },
        }),

        this.prisma.user_report.count({where}),
      ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateStatus(id: string,currentStatus: user_report_status,newStatus: user_report_status,
    handledBy: string) {
    const result =await this.prisma.user_report.updateMany({
        where: {id,status: currentStatus},

        data: {
          status: newStatus,
          handled_by: handledBy,
          handled_at: new Date(),
        },
      });

    if (result.count === 0) throw new Error('Report was modified by another admin');
 

    return this.prisma.user_report.findUnique({
      where: {id},
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
            display_name: true,
            avatar_url: true,
            cover_url: true,
            bio: true,
            gender: true,
            birthday: true,
            location: true,
            privacy: true,
            created_at: true,
            updated_at: true
          }},

        reported_user: {
          select: {
            id: true,
            username: true,
            display_name: true,
            avatar_url: true,
            cover_url: true,
            bio: true,
            gender: true,
            birthday: true,
            location: true,
            privacy: true,
            created_at: true,
            updated_at: true,
          }},
      },
    });
  }
}