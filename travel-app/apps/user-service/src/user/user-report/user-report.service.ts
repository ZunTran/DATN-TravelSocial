import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  user_report_status,
} from '@prisma/client';

import { UserProfileRepository } from '../user-profile/user-profile.repository';
import { UserReportRepository } from './user-report.repository';
import { UserReportInput } from './dto/user-report.dto';
import { GetUserReportsInput } from './dto/admin-user-report.dto';
import { UpdateReportStatusInput } from './dto/update-report-status.dto';
import { NotificationService } from '../notification/notification.service';


@Injectable()
export class UserReportService {
  constructor(
    private readonly userReportRepository: UserReportRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly notificationService: NotificationService
  ) {}

  async createReport(
  accountId: string,
  input: UserReportInput,
) {
  const reporter =
    await this.userProfileRepository.findByAccountId(
      accountId,
    );

  if (!reporter) {
    throw new NotFoundException('User profile not found');
  }

  if (reporter.id === input.reportedUserId) {
    throw new BadRequestException( 'Bạn không thể báo cáo chính mình' );
  }

  const reportedUser =
    await this.userProfileRepository.findById(
      input.reportedUserId,
    );

  if (!reportedUser) {
    throw new NotFoundException( 'Không tìm thấy người dùng cần báo cáo' );
  }

  const reason = input.reason.trim();

  if (!reason) {
    throw new BadRequestException('Nội dung báo cáo không được để trống');
  }

  const existing = await this.userReportRepository.findPendingByReporterAndUser( reporter.id, reportedUser.id);
  if (existing) {
    throw new ConflictException( 'Bạn đã báo cáo người dùng này và báo cáo đang chờ xử lý');
  }

  try {
    return await this.userReportRepository.create(
      reporter.id,
      reportedUser.id,
      reason,
    );
  } catch (error: any) {
    if (error?.code === 'P2002') {
      throw new ConflictException(
        'Bạn đã báo cáo người dùng này và báo cáo đang chờ xử lý',
      );
    }

    throw error;
  }
}

  async myReports(
    accountId: string,
    page: number,
    limit: number,
  ) {
    const profile =
      await this.userProfileRepository.findByAccountId(
        accountId,
      );

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return this.userReportRepository.findMyReports(
      profile.id,
      page,
      limit,
    );
  }

  async getReports(
    input: GetUserReportsInput,
  ) {
    return this.userReportRepository.findPaginated({
      page: input.page,
      limit: input.limit,
      status: input.status,
    });
  }

  async getReportById(id: string) {
    const report =
      await this.userReportRepository.findById(id);

    if (!report) {
      throw new NotFoundException(
        'User report not found',
      );
    }

    return report;
  }

  async updateReportStatus(
  reportId: string,
  adminAccountId: string,
  input: UpdateReportStatusInput,
) {
  const report =
    await this.userReportRepository.findById(
      reportId,
    );

  if (!report) {
    throw new NotFoundException(
      'User report not found',
    );
  }

  const currentStatus = report.status;
  const newStatus = input.status;

  if (currentStatus === newStatus) {
    throw new ConflictException( 'Report already has this status' );
  }

  if (
    currentStatus === user_report_status.RESOLVED ||
    currentStatus === user_report_status.REJECTED
  ) {
    throw new ConflictException( 'Report has already been closed' );
  }


  if (
    currentStatus === user_report_status.REVIEWING &&
    newStatus === user_report_status.PENDING
  ) {
    throw new ConflictException(
      'Cannot move report back to PENDING',
    );
  }


  const allowedTransitions: Record<
    user_report_status,
    user_report_status[]
  > = {
    [user_report_status.PENDING]: [
      user_report_status.REVIEWING,
      user_report_status.RESOLVED,
      user_report_status.REJECTED,
    ],

    [user_report_status.REVIEWING]: [
      user_report_status.RESOLVED,
      user_report_status.REJECTED,
    ],

    [user_report_status.RESOLVED]: [],

    [user_report_status.REJECTED]: [],
  };

  if (
    !allowedTransitions[currentStatus].includes(
      newStatus,
    )
  ) {
    throw new BadRequestException(
      `Invalid report status transition: ${currentStatus} -> ${newStatus}`,
    );
  }

  const adminProfile =
    await this.userProfileRepository.findByAccountId(
      adminAccountId,
    );

  if (!adminProfile) {
    throw new NotFoundException('Admin profile not found');
  }


  const updatedReport =
  await this.userReportRepository.updateStatus(
    reportId,
    currentStatus,
    newStatus,
    adminProfile.id,
  );

  if(updatedReport){
      await this.notificationService.createReportStatusNotification(updatedReport.reporter_id, newStatus);
  }

  return updatedReport;

}

}