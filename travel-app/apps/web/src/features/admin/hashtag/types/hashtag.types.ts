export interface AdminHashtag {
  id: string;
  name: string;
  postCount: number;
}

export interface AdminHashtagList {
  items: AdminHashtag[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminHashtagFilter {
  search?: string;
  page: number;
  limit: number;
}

export interface CreateHashtagInput {
  name: string;
}

export interface UpdateHashtagInput {
  id: string;
  name: string;
}