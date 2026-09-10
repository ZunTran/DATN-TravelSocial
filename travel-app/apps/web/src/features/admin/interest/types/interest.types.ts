export interface AdminInterest {
  id: string;
  name: string;
  icon_url?: string | null;
  created_at: string;
}

export interface AdminInterestPage {
  data: AdminInterest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}