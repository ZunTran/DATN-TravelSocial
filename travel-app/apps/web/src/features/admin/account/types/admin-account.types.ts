export type AdminAccountStatus =
  | 'ACTIVE'
  | 'BANNED'
  | 'LOCKED'
  | string;

export interface AdminAccount {
  id: string;
  email: string;
  username: string | null;
  displayName: string | null;
  status: AdminAccountStatus;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface AdminAccountPage {
  items: AdminAccount[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminAccountFilter {
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminAccountsQuery {
  adminAccounts: AdminAccountPage;
}