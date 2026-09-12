export interface GatewayLocation {
  id: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  province: string | null;
}

export interface GatewayLocationPage {
  items: GatewayLocation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
}