import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { UserProfileClient } from '../../common/clients/user-profile/user-profile.client';

import { TravelPlanRepository } from './travel-plan.repository';

import { CreateTravelPlanInput } from './dto/create-travel-plan.input';
import { UpdateTravelPlanInput } from './dto/update-travel-plan.input';

import { PaginationInput } from '../../common/dto/pagination.input';
import { TravelPlanList } from './objects/travel-plan-list.object';
import { TravelPlanObject } from './objects/travel-plan.object';

import { TravelPlanStatus } from '../enums/travel-plan-status.enum';
import type { TravelPlanRecord } from './types/travel-plan.type';
import { TravelPlanItemRepository } from '../travel-plan-item/travel-plan-item.repository';

@Injectable()
export class TravelPlanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: TravelPlanRepository,
    private readonly travelPlanItemRepository: TravelPlanItemRepository,
    private readonly userProfileClient: UserProfileClient,
  ) {}

private mapTravelPlan(
  plan: TravelPlanRecord,
): TravelPlanObject {
  return {
    id: plan.id,
    userId: plan.user_id,
    title: plan.title,
    destination: plan.destination,

    input: JSON.stringify(plan.input),

    content: plan.content,
    status: plan.status,
    createdAt: plan.created_at,
    updatedAt: plan.updated_at,

    items: plan.items.map(
      (item) => ({
        id: item.id,

        travelPlanId:
          item.travel_plan_id,

        dayIndex:
          item.day_index,

        timeSlot:
          item.time_slot,

        activityName:
          item.activity_name,

        locationId:
          item.location_id,

        description:
          item.description,

        costEstimate:
          item.cost_estimate !== null
            ? Number(
                item.cost_estimate,
              )
            : null,
      }),
    ),
  };
}
  private async getUserId(
    accountId: string,
  ): Promise<string> {
    const profile =
      await this.userProfileClient.getByAccountId(
        accountId,
      );

    if (!profile) {
      throw new NotFoundException(
        'User profile not found',
      );
    }

    return profile.profileId;
  }

async create(
  accountId: string,
  input: CreateTravelPlanInput,
): Promise<TravelPlanObject> {
  const userId =
    await this.getUserId(accountId);

  let parsedInput: Prisma.InputJsonValue;

  try {
    parsedInput = JSON.parse(input.input);
  } catch {
    throw new BadRequestException(
      'input must be valid JSON',
    );
  }

  return this.prisma.$transaction(
    async (tx) => {
      const plan =
        await this.repository.create(
          tx,
        {
          userId,
          title: input.title.trim(),
          destination: input.destination.trim(),
          input: parsedInput,
          content: input.content.trim(),
        }
      );

       if (input.items?.length) {
      for (const item of input.items) {
        await this.travelPlanItemRepository.create(
          tx,
          {
            travelPlanId: plan.id,
            dayIndex: item.dayIndex,
            timeSlot: item.timeSlot,
            activityName: item.activityName.trim(),
            locationId: item.locationId,
            description: item.description?.trim(),
            costEstimate: item.costEstimate,
          },
        );
      }
    }
    
      return this.mapTravelPlan(plan);
    },
  );
}

  async findById(
    accountId: string,
    id: string,
  ): Promise<TravelPlanObject> {
    const userId =
      await this.getUserId(accountId);

    const plan =
      await this.repository.findByIdForUser(
        id,
        userId,
      );

    if (!plan) {
      throw new NotFoundException(
        'Travel plan not found',
      );
    }

    return this.mapTravelPlan(plan);
  }

  async findMany(
    accountId: string,
    pagination: PaginationInput,
  ): Promise<TravelPlanList> {
    const userId =
      await this.getUserId(accountId);

    const page = Math.max(
      1,
      pagination?.page ?? 1,
    );

    const limit = Math.min(
      Math.max(
        1,
        pagination?.limit ?? 20,
      ),
      100,
    );

    const skip = (page - 1) * limit;

    const [items, total] =
      await Promise.all([
        this.repository.findByUser(
          userId,
          skip,
          limit,
        ),

        this.repository.countByUser(
          userId,
        ),
      ]);

    return {
      items: items.map((item) =>
        this.mapTravelPlan(item),
      ),
      total,
      page,
      limit,
      totalPages: Math.ceil(
        total / limit,
      ),
    };
  }

  async update(
    accountId: string,
    input: UpdateTravelPlanInput,
  ): Promise<TravelPlanObject> {
    const userId =
      await this.getUserId(accountId);

    const existing =
      await this.repository.findByIdForUser(
        input.id,
        userId,
      );

    if (!existing) {
      throw new NotFoundException(
        'Travel plan not found',
      );
    }

    if (
      existing.status ===
      TravelPlanStatus.DELETED
    ) {
      throw new BadRequestException(
        'Cannot update a deleted travel plan',
      );
    }

    const data: Prisma.travel_planUpdateInput =
      {};

    if (input.title !== undefined) {
      data.title = input.title.trim();
    }

    if (input.destination !== undefined) {
      data.destination =
        input.destination.trim();
    }

    if (input.content !== undefined) {
      data.content =
        input.content.trim();
    }

    if (input.input !== undefined) {
      try {
        data.input = JSON.parse(
          input.input,
        );
      } catch {
        throw new BadRequestException(
          'input must be valid JSON',
        );
      }
    }

    if (input.status !== undefined) {
      data.status = input.status;
    }

    return this.prisma.$transaction(
      async (tx) => {
        const updated =
          await this.repository.update(
            tx,
            input.id,
            data,
          );

        return this.mapTravelPlan(updated);
      },
    );
  }

  async delete(
    accountId: string,
    id: string,
  ): Promise<boolean> {
    const userId =
      await this.getUserId(accountId);

    const existing =
      await this.repository.findByIdForUser(
        id,
        userId,
      );

    if (!existing) {
      throw new NotFoundException(
        'Travel plan not found',
      );
    }

    if (
      existing.status ===
      TravelPlanStatus.DELETED
    ) {
      return true;
    }

    await this.prisma.$transaction(
      async (tx) => {
        await this.repository.update(
          tx,
          id,
          {
            status:
              TravelPlanStatus.DELETED,
          },
        );
      },
    );

    return true;
  }
}