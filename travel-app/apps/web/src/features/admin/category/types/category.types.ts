export interface AdminCategory {
  id: string;
  name: string;
  description?: string | null;
}

export interface AdminCategoryPage {
  items: AdminCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface CategoryFilter {
  search?: string;
  page: number;
  limit: number;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  id: string;
  name: string;
  description?: string;
}