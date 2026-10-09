export type UserReportStatus = | 'PENDING' | 'REVIEWING' | 'RESOLVED' | 'REJECTED';

export interface UserReportUserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
}

export interface UserReport {
  id: string;

  reporter_id: string;
  reported_user_id: string;

  reason: string;

  status: UserReportStatus;

  handled_by?: string | null;
  handled_at?: string | null;

  created_at: string;

  reporter?: UserReportUserProfile | null;
  reported_user?: UserReportUserProfile | null;
}

export interface UserReportPage {
  data: UserReport[];

  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserReportInput {
  reportedUserId: string;
  reason: string;
}

export interface GetUserReportsInput {
  page: number;
  limit: number;
  status?: UserReportStatus;
}

export interface MyUserReportsInput {
  page: number;
  limit: number;
}

export interface UpdateReportStatusInput {
  status: UserReportStatus;
}

export interface ReportUserResponse {
  reportUser: UserReport;
}

export interface MyUserReportsResponse {
  myUserReports: UserReportPage;
}

export interface AdminUserReportsResponse {
  adminUserReports: UserReportPage;
}

export interface AdminUserReportResponse {
  adminUserReport: UserReport;
}

export interface UpdateUserReportStatusResponse {
  updateUserReportStatus: UserReport;
}