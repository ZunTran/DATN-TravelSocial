export interface CategoryOption {
  id: string;
  name: string;
  description?: string | null;
}

export interface CategoryPage {
  items: CategoryOption[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
}