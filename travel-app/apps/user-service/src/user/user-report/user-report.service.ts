import {BadRequestException,ConflictException,Injectable,NotFoundException} from '@nestjs/common';
import { UserProfileRepository } from '../user-profile/user-profile.repository';
import { UserReportRepository } from './user-report.repository';
import { UserReportInput } from './dto/user-report.dto';
import { GetUserReportsInput } from './dto/admin-user-report.dto';
import { UpdateReportStatusInput } from './dto/update-report-status.dto';
import { user_report_status } from '@prisma/client';

@Injectable()
export class UserReportService {
  constructor(
    private readonly userReportRepository: UserReportRepository,
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

  async createReport(accountId: string,
    dto: UserReportInput) {
    const reporter =await this.userProfileRepository.findByAccountId(accountId);
    if (!reporter) throw new NotFoundException('User profile not found');
  
    if (reporter.id === dto.reportedUserId)  throw new BadRequestException('You cannot report yourself');
    const reportedUser = await this.userProfileRepository.findById(dto.reportedUserId);
    if (!reportedUser) throw new NotFoundException('Reported user not found');

    const existing =await this.userReportRepository.findPendingByReporterAndUser(reporter.id,dto.reportedUserId);
    if (existing) throw new ConflictException('You already have a pending report for this user');
    
    try {
      return await this.userReportRepository.create(
        reporter.id,
        dto.reportedUserId,
        dto.reason.trim(),
      );
    } catch (error: any) {
      if (error?.code === 'P2002') throw new ConflictException('You already have a pending report for this user');

      throw error;
    }
  }

  async myReports(accountId: string,page: number,limit: number) {
    const profile =await this.userProfileRepository.findByAccountId(accountId,);
    if (!profile)  throw new NotFoundException('User profile not found');
    
    return this.userReportRepository.findMyReports(
      profile.id,
      page,
      limit,
    );
  }


  async getReports(dto: GetUserReportsInput) {
    return this.userReportRepository.findPaginated({
      page: dto.page,
      limit: dto.limit,
      status: dto.status,
    });
  }

  async getReportById(id: string) {
    const report =await this.userReportRepository.findById(id);
    if (!report) throw new NotFoundException('User report not found');

    return report;
  }

  async updateReportStatus(reportId: string,adminId: string,
    dto: UpdateReportStatusInput) {
    const report =await this.userReportRepository.findById(reportId);

    if (!report) throw new NotFoundException('User report not found');

    if (
      report.status === user_report_status.RESOLVED ||
      report.status === user_report_status.REJECTED
    ) {
      throw new ConflictException('Report has already been closed');
    }

    if (
      report.status === user_report_status.REVIEWING &&
      dto.status === user_report_status.PENDING
    ) {
      throw new ConflictException('Cannot move report back to PENDING');
    }

    return this.userReportRepository.updateStatus(
      reportId,
      report.status,
      dto.status,
      adminId,
    );
  }
}