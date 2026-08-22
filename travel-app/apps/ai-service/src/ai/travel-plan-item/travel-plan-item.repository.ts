import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import type { TravelPlanItemRecord } from './types/travel-plan-item.type';

const travelPlanItemSelect =
  Prisma.validator<Prisma.travel_plan_itemSelect>()({
    id: true,
    travel_plan_id: true,
    day_index: true,
    time_slot: true,
    activity_name: true,
    location_id: true,
    description: true,
    cost_estimate: true,
  });

@Injectable()
export class TravelPlanItemRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    tx: Prisma.TransactionClient,
    data: {
      travelPlanId: string;
      dayIndex: number;
      timeSlot?: string | null;
      activityName: string;
      locationId?: string | null;
      description?: string | null;
      costEstimate?: number | null;
    },
  ): Promise<TravelPlanItemRecord> {
    return tx.travel_plan_item.create({
      data: {
        travel_plan_id: data.travelPlanId,
        day_index: data.dayIndex,
        time_slot: data.timeSlot,
        activity_name: data.activityName,
        location_id: data.locationId,
        description: data.description,
        cost_estimate: data.costEstimate,
      },
      select: travelPlanItemSelect,
    });
  }

  async findById(
    id: string,
  ): Promise<TravelPlanItemRecord | null> {
    return this.prisma.travel_plan_item.findUnique({
      where: {
        id,
      },
      select: travelPlanItemSelect,
    });
  }

  async findByIdForUser(
    id: string,
    userId: string,
  ): Promise<TravelPlanItemRecord | null> {
    return this.prisma.travel_plan_item.findFirst({
      where: {
        id,
        travel_plan: {
          user_id: userId,
        },
      },
      select: travelPlanItemSelect,
    });
  }

  async findByTravelPlan(
    travelPlanId: string,
    userId: string,
    skip: number,
    take: number,
  ): Promise<TravelPlanItemRecord[]> {
    return this.prisma.travel_plan_item.findMany({
      where: {
        travel_plan_id: travelPlanId,
        travel_plan: {
          user_id: userId,
        },
      },
      orderBy: [
        {
          day_index: 'asc',
        },
        {
          time_slot: 'asc',
        },
      ],
      skip,
      take,
      select: travelPlanItemSelect,
    });
  }

  async countByTravelPlan(
    travelPlanId: string,
    userId: string,
  ): Promise<number> {
    return this.prisma.travel_plan_item.count({
      where: {
        travel_plan_id: travelPlanId,
        travel_plan: {
          user_id: userId,
        },
      },
    });
  }

  async update(
    tx: Prisma.TransactionClient,
    id: string,
    data: Prisma.travel_plan_itemUpdateInput,
  ): Promise<TravelPlanItemRecord> {
    return tx.travel_plan_item.update({
      where: {
        id,
      },
      data,
      select: travelPlanItemSelect,
    });
  }

  async delete(
    tx: Prisma.TransactionClient,
    id: string,
  ): Promise<void> {
    await tx.travel_plan_item.delete({
      where: {
        id,
      },
    });
  }
}