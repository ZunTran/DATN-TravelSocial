import { Injectable } from '@nestjs/common';
import { CreateTravelPlanInput } from './dto/create-travel-plan.input';

@Injectable()
export class TravelPlanQueryService {
  buildSearchQuery(input: CreateTravelPlanInput) {
    const parts = [
      input.destination,
      input.query,
      ...(input.interests ?? []),
      input.travelStyle,
      input.category,
    ].filter(Boolean);

    return parts.join(', ');
  }
}