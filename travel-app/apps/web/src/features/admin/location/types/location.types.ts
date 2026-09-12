export interface Location {
  id: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  province: string | null;
}

export interface LocationPage {
  items: Location[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface LocationFilter {
  search?: string;
  province?: string;
  page?: number;
  limit?: number;
}

export interface AdminLocationFilter {
  search?: string;
  province?: string;
  page?: number;
  limit?: number;
}

export interface CreateLocationInput {
  name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  province?: string | null;
}

export interface UpdateLocationInput
  extends CreateLocationInput {
  id: string;
}