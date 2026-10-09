export interface HashtagOption {
  id: string;
  name: string;
}

export interface HashtagPage {
  items: HashtagOption[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
}