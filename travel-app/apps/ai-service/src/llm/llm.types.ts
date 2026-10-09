export interface TravelPlanLocation {
  locationId: string;
  name: string;
  address?: string | null;
  description?: string | null;
  category?: string | null;
  province?: string | null;
  estimatedCost?: number | null;
  durationMinutes?: number | null;
  openingHours?: string | null;
  similarity?: number | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface GeneratedTravelPlanItem {
  dayIndex: number;
  timeSlot: string;
  activityName: string;
  locationId: string;
  description: string;
  costEstimate: number;
}

export interface GeneratedTravelPlan {
  title: string;
  content: string;
  items: GeneratedTravelPlanItem[];
}