import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { TravelPlanStatus } from '../enums/travel-plan-status.enum';
import type { TravelPlanRecord } from './types/travel-plan.type';

const travelPlanSelect =
  Prisma.validator<Prisma.travel_planSelect>()({
    id: true,
    user_id: true,
    title: true,
    destination: true,
    input: true,
    content: true,
    status: true,
    created_at: true,
    updated_at: true,

    items: {
      select: {
        id: true,
        travel_plan_id: true,
        day_index: true,
        time_slot: true,
        activity_name: true,
        location_id: true,
        description: true,
        cost_estimate: true,
      },
      orderBy: [
        { day_index: 'asc' },
        { time_slot: 'asc' },
      ],
    },
  });

@Injectable()
export class TravelPlanRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    tx: Prisma.TransactionClient,
    data: {
      userId: string;
      title: string;
      destination: string;
      input: Prisma.InputJsonValue;
      content: string;
    },
  ): Promise<TravelPlanRecord> {
    return tx.travel_plan.create({
      data: {
        user_id: data.userId,
        title: data.title,
        destination: data.destination,
        input: data.input,
        content: data.content,
      },
      select: travelPlanSelect,
    });
  }

  async findByIdForUser(
    id: string,
    userId: string,
  ): Promise<TravelPlanRecord | null> {
    return this.prisma.travel_plan.findFirst({
      where: {
        id,
        user_id: userId,
      },
      select: travelPlanSelect,
    });
  }

  async findByUser(
    userId: string,
    skip: number,
    take: number,
  ): Promise<TravelPlanRecord[]> {
    return this.prisma.travel_plan.findMany({
      where: {
        user_id: userId,
        status: {
          not: TravelPlanStatus.DELETED,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      skip,
      take,
      select: travelPlanSelect,
    });
  }

  async countByUser(
    userId: string,
  ): Promise<number> {
    return this.prisma.travel_plan.count({
      where: {
        user_id: userId,
        status: {
          not: TravelPlanStatus.DELETED,
        },
      },
    });
  }

  async update(
    tx: Prisma.TransactionClient,
    id: string,
    data: Prisma.travel_planUpdateInput,
  ): Promise<TravelPlanRecord> {
    return tx.travel_plan.update({
      where: {
        id,
      },
      data,
      select: travelPlanSelect,
    });
  }
}