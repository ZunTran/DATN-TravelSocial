
export type TravelPlanStatus =
  | 'ACTIVE'
  | 'DELETED';

export interface TravelPlanItem {
  id: string;
  travelPlanId: string;
  dayIndex: number;
  timeSlot: string | null;
  activityName: string;
  locationId: string | null;
  description: string | null;
  costEstimate: number | null;
}

export interface TravelPlan {
  id: string;
  userId: string;
  title: string;
  destination: string;
  input: string;
  content: string;
  status: TravelPlanStatus;
  createdAt: string;
  updatedAt: string;
  items: TravelPlanItem[];
}

export interface TravelPlanList {
  items: TravelPlan[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateTravelPlanInput {
  destination: string;
  numberOfDays: number;

  province?: string;
  category?: string;

  minCost?: number;
  maxCost?: number;

  minDuration?: number;
  maxDuration?: number;

  interests?: string[];

  travelStyle?: string;
  query?: string;

  limit?: number;
}

export interface UpdateTravelPlanInput {
  id: string;

  title?: string;
  destination?: string;
  input?: string;
  content?: string;
  status?: TravelPlanStatus;
}

export interface TravelPlansVariables {
  pagination: {
    page: number;
    limit: number;
  };
}

