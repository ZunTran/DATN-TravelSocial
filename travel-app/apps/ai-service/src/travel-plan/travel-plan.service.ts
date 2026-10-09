import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TravelPlanStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TravelPlanRepository } from './travel-plan.repository';
import { TravelPlanItemRepository } from '../ai/travel-plan-item/travel-plan-item.repository';
import { TravelPlanQueryService } from './travel-plan-query.service';
import { SocialLocationClient } from '../social/social-location.client';
import { LlmService } from '../llm/llm.service';
import { UserProfileClient } from '../common/clients/user-profile/user-profile.client';
import { CreateTravelPlanInput } from './dto/create-travel-plan.input';
import { TravelPlanObject } from './types/travel-plan.object';
import { PaginationInput } from '../common/dto/pagination.input';
import { TravelPlanList } from '../ai/travel-plan-item/types/travel-plan-list.object';
import { UpdateTravelPlanInput } from './dto/update-travel-plan.input';
import { TravelPlanLocation } from '../llm/llm.types';
import { TravelPlanRecord } from './types/travel-plan.type';


@Injectable()
export class TravelPlanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: TravelPlanRepository,
    private readonly travelPlanItemRepository: TravelPlanItemRepository,
    private readonly queryService: TravelPlanQueryService,
    private readonly socialLocationClient: SocialLocationClient,
    private readonly llmService: LlmService,
    private readonly userProfileClient: UserProfileClient,
  ) {}

  async create(accountId: string, input: CreateTravelPlanInput): Promise<TravelPlanObject> {
    const userId = await this.getUserId(accountId);

    const searchQuery = this.queryService.buildSearchQuery(input);

    const locations = await this.socialLocationClient.hybridSearch({
      query: searchQuery,
      province: input.province ?? input.destination,
      category: input.category,
      minCost: input.minCost,
      maxCost: input.maxCost,
      minDuration: input.minDuration,
      maxDuration: input.maxDuration,
      limit: input.limit ?? 10,
    });

    if (!locations.length) {
      throw new BadRequestException('Không tìm thấy địa điểm phù hợp.');
    }

    const generated = await this.llmService.generateTravelPlan(input, locations);

    this.validateGeneratedPlan(generated, locations, input.numberOfDays);

    return this.prisma.$transaction(async (tx) => {
      const plan = await this.repository.create(tx, {
        userId,
        title: generated.title.trim(),
        destination: input.destination.trim(),
        input: this.buildStoredInput(input),
        content: generated.content.trim(),
      });

      for (const item of generated.items) {
        await this.travelPlanItemRepository.create(tx, {
          travelPlanId: plan.id,
          dayIndex: item.dayIndex,
          timeSlot: item.timeSlot,
          activityName: item.activityName.trim(),
          locationId: item.locationId,
          description: item.description?.trim(),
          costEstimate: item.costEstimate,
        });
      }

      const savedPlan = await this.repository.findByIdForUserTx(tx, plan.id, userId);

      if (!savedPlan) {
        throw new NotFoundException('Không tìm thấy travel plan sau khi tạo.');
      }

      return this.mapTravelPlan(savedPlan);
    });
  }

  async findById(accountId: string, id: string): Promise<TravelPlanObject> {
    const userId = await this.getUserId(accountId);
    const plan = await this.repository.findByIdForUser(id, userId);

    if (!plan) {
      throw new NotFoundException('Travel plan not found');
    }

    return this.mapTravelPlan(plan);
  }

  async findMany(accountId: string, pagination: PaginationInput): Promise<TravelPlanList> {
    const userId = await this.getUserId(accountId);
    const page = Math.max(1, pagination?.page ?? 1);
    const limit = Math.min(Math.max(1, pagination?.limit ?? 20), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.repository.findByUser(userId, skip, limit),
      this.repository.countByUser(userId),
    ]);

    return {
      items: items.map((item) => this.mapTravelPlan(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(accountId: string, input: UpdateTravelPlanInput): Promise<TravelPlanObject> {
    const userId = await this.getUserId(accountId);
    const existing = await this.repository.findByIdForUser(input.id, userId);

    if (!existing) {
      throw new NotFoundException('Travel plan not found');
    }

    if (existing.status === TravelPlanStatus.DELETED) {
      throw new BadRequestException('Cannot update a deleted travel plan');
    }

    const data: Prisma.travel_planUpdateInput = {};

    if (input.title !== undefined) data.title = input.title.trim();
    if (input.destination !== undefined) data.destination = input.destination.trim();
    if (input.content !== undefined) data.content = input.content.trim();

    if (input.input !== undefined) {
      try {
        data.input = JSON.parse(input.input);
      } catch {
        throw new BadRequestException('input must be valid JSON');
      }
    }

    if (input.status !== undefined) data.status = input.status;

    return this.prisma.$transaction(async (tx) => {
      const updated = await this.repository.update(tx, input.id, data);
      return this.mapTravelPlan(updated);
    });
  }

  async delete(accountId: string, id: string): Promise<boolean> {
    const userId = await this.getUserId(accountId);
    const existing = await this.repository.findByIdForUser(id, userId);

    if (!existing) {
      throw new NotFoundException('Travel plan not found');
    }

    if (existing.status === TravelPlanStatus.DELETED) {
      return true;
    }

    await this.prisma.$transaction(async (tx) => {
      await this.repository.update(tx, id, {
        status: TravelPlanStatus.DELETED,
      });
    });

    return true;
  }

  private buildStoredInput(input: CreateTravelPlanInput): Prisma.InputJsonValue {
    return {
      destination: input.destination,
      numberOfDays: input.numberOfDays,
      province: input.province ?? null,
      category: input.category ?? null,
      minCost: input.minCost ?? null,
      maxCost: input.maxCost ?? null,
      minDuration: input.minDuration ?? null,
      maxDuration: input.maxDuration ?? null,
      interests: input.interests ?? [],
      travelStyle: input.travelStyle ?? null,
      query: input.query ?? null,
      limit: input.limit ?? 10,
    } as Prisma.InputJsonValue;
  }

  private validateGeneratedPlan(generated: any, locations: TravelPlanLocation[], numberOfDays: number): void {
    if (!generated || typeof generated.title !== 'string' || typeof generated.content !== 'string' || !Array.isArray(generated.items)) {
      throw new BadRequestException('AI trả về lịch trình không hợp lệ.');
    }

    const validLocationIds = new Set(locations.map((location) => location.locationId));

    for (const item of generated.items) {
      if (!Number.isInteger(item.dayIndex) || item.dayIndex < 1 || item.dayIndex > numberOfDays) {
        throw new BadRequestException(`AI trả về dayIndex không hợp lệ: ${item.dayIndex}`);
      }

      if (!item.locationId || !validLocationIds.has(item.locationId)) {
        throw new BadRequestException(`AI trả về locationId không tồn tại: ${item.locationId}`);
      }

      if (typeof item.timeSlot !== 'string') {
        throw new BadRequestException('AI trả về timeSlot không hợp lệ.');
      }

      if (typeof item.activityName !== 'string') {
        throw new BadRequestException('AI trả về activityName không hợp lệ.');
      }

      if (typeof item.description !== 'string') {
        throw new BadRequestException('AI trả về description không hợp lệ.');
      }

      if (typeof item.costEstimate !== 'number' || !Number.isFinite(item.costEstimate) || item.costEstimate < 0) {
        throw new BadRequestException('AI trả về costEstimate không hợp lệ.');
      }
    }
  }

  private mapTravelPlan(plan: TravelPlanRecord): TravelPlanObject {
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
      items: plan.items.map((item) => ({
        id: item.id,
        travelPlanId: item.travel_plan_id,
        dayIndex: item.day_index,
        timeSlot: item.time_slot,
        activityName: item.activity_name,
        locationId: item.location_id,
        description: item.description,
        costEstimate: item.cost_estimate !== null ? Number(item.cost_estimate) : null,
      })),
    };
  }

  private async getUserId(accountId: string): Promise<string> {
    const profile = await this.userProfileClient.getByAccountId(accountId);

    if (!profile?.profileId) {
      throw new NotFoundException('Không tìm thấy user profile.');
    }

    return profile.profileId;
  }
}