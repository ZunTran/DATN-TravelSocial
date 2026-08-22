import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { UserProfileClient } from '../../common/clients/user-profile/user-profile.client';

import { TravelPlanItemRepository } from './travel-plan-item.repository';

import { CreateTravelPlanItemInput } from './dto/create-travel-plan-item.input';
import { UpdateTravelPlanItemInput } from './dto/update-travel-plan-item.input';

import { PaginationInput } from '../../common/dto/pagination.input';

import { TravelPlanItemObject } from './objects/travel-plan-item.object';
import { TravelPlanItemList } from './objects/travel-plan-item-list.object';

import type { TravelPlanItemRecord } from './types/travel-plan-item.type';

@Injectable()
export class TravelPlanItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: TravelPlanItemRepository,
    private readonly userProfileClient: UserProfileClient,
  ) {}

  private mapTravelPlanItem(
    item: TravelPlanItemRecord,
  ): TravelPlanItemObject {
    return {
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
          ? Number(item.cost_estimate)
          : null,
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

  /**
   * Kiểm tra travel plan có thuộc current user không.
   */
  private async ensureTravelPlanOwner(
    travelPlanId: string,
    userId: string,
  ): Promise<void> {
    const travelPlan =
      await this.prisma.travel_plan.findFirst({
        where: {
          id: travelPlanId,
          user_id: userId,
        },
        select: {
          id: true,
        },
      });

    if (!travelPlan) {
      throw new NotFoundException(
        'Travel plan not found',
      );
    }
  }

  async create(
    accountId: string,
    input: CreateTravelPlanItemInput,
  ): Promise<TravelPlanItemObject> {
    const userId =
      await this.getUserId(accountId);

    await this.ensureTravelPlanOwner(
      input.travelPlanId,
      userId,
    );

    const activityName =
      input.activityName.trim();

    if (!activityName) {
      throw new BadRequestException(
        'activityName cannot be empty',
      );
    }

    return this.prisma.$transaction(
      async (tx) => {
        const item =
          await this.repository.create(
            tx,
            {
              travelPlanId:
                input.travelPlanId,

              dayIndex:
                input.dayIndex,

              timeSlot:
                input.timeSlot?.trim() || null,

              activityName,

              locationId:
                input.locationId ?? null,

              description:
                input.description?.trim() || null,

              costEstimate:
                input.costEstimate ?? null,
            },
          );

        return this.mapTravelPlanItem(item);
      },
    );
  }

  async findById(
    accountId: string,
    id: string,
  ): Promise<TravelPlanItemObject> {
    const userId =
      await this.getUserId(accountId);

    const item =
      await this.repository.findByIdForUser(
        id,
        userId,
      );

    if (!item) {
      throw new NotFoundException(
        'Travel plan item not found',
      );
    }

    return this.mapTravelPlanItem(item);
  }

  async findMany(
    accountId: string,
    travelPlanId: string,
    pagination: PaginationInput,
  ): Promise<TravelPlanItemList> {
    const userId =
      await this.getUserId(accountId);

    await this.ensureTravelPlanOwner(
      travelPlanId,
      userId,
    );

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

    const skip =
      (page - 1) * limit;

    const [items, total] =
      await Promise.all([
        this.repository.findByTravelPlan(
          travelPlanId,
          userId,
          skip,
          limit,
        ),

        this.repository.countByTravelPlan(
          travelPlanId,
          userId,
        ),
      ]);

    return {
      items: items.map((item) =>
        this.mapTravelPlanItem(item),
      ),

      total,

      page,

      limit,

      totalPages:
        Math.ceil(total / limit),
    };
  }

  async update(
    accountId: string,
    input: UpdateTravelPlanItemInput,
  ): Promise<TravelPlanItemObject> {
    const userId =
      await this.getUserId(accountId);

    const existing =
      await this.repository.findByIdForUser(
        input.id,
        userId,
      );

    if (!existing) {
      throw new NotFoundException(
        'Travel plan item not found',
      );
    }

    const data: Prisma.travel_plan_itemUpdateInput =
      {};

    if (
      input.dayIndex !== undefined
    ) {
      data.day_index =
        input.dayIndex;
    }

    if (
      input.timeSlot !== undefined
    ) {
      data.time_slot =
        input.timeSlot.trim() || null;
    }

    if (
      input.activityName !== undefined
    ) {
      const activityName =
        input.activityName.trim();

      if (!activityName) {
        throw new BadRequestException(
          'activityName cannot be empty',
        );
      }

      data.activity_name =
        activityName;
    }

    if (
      input.locationId !== undefined
    ) {
      data.location_id =
        input.locationId;
    }

    if (
      input.description !== undefined
    ) {
      data.description =
        input.description.trim() || null;
    }

    if (
      input.costEstimate !== undefined
    ) {
      data.cost_estimate =
        input.costEstimate;
    }

    if (
      Object.keys(data).length === 0
    ) {
      throw new BadRequestException(
        'No fields to update',
      );
    }

    return this.prisma.$transaction(
      async (tx) => {
        const updated =
          await this.repository.update(
            tx,
            input.id,
            data,
          );

        return this.mapTravelPlanItem(
          updated,
        );
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
        'Travel plan item not found',
      );
    }

    await this.prisma.$transaction(
      async (tx) => {
        await this.repository.delete(
          tx,
          id,
        );
      },
    );

    return true;
  }
}