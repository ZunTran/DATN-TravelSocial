import { Injectable } from '@nestjs/common';
import {Prisma} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RecommendationType } from '../enums/recommendation-type.enum'
import { RecommendationLogRecord} from './types/Recommendation.type';

const recommendationLogSelect = Prisma.validator<Prisma.recommendation_logSelect>()({
    id: true,
    user_id: true,
    type: true,
    reference_id: true,
    score: true,
    created_at: true,
  });

@Injectable()
export class RecommendationLogRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    tx: Prisma.TransactionClient,
    data: {
      userId: string;
      type: RecommendationType;
      referenceId: string;
      score?: number;
    },
  ): Promise<RecommendationLogRecord> {
    return tx.recommendation_log.create({
      data: {
        user_id: data.userId,
        type: data.type,
        reference_id: data.referenceId,
        score: data.score,
      },
      select: recommendationLogSelect,
    });
  }

  async findById(
    id: string,
  ): Promise<RecommendationLogRecord | null> {
    return this.prisma.recommendation_log.findUnique({
      where: {
        id,
      },
      select: recommendationLogSelect,
    });
  }

  async findByUser(
    userId: string,
    skip: number,
    take: number,
  ): Promise<RecommendationLogRecord[]> {
    return this.prisma.recommendation_log.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
      skip,
      take,
      select: recommendationLogSelect,
    });
  }

  async countByUser(
    userId: string,
  ): Promise<number> {
    return this.prisma.recommendation_log.count({
      where: {
        user_id: userId,
      },
    });
  }

  async delete(
    tx: Prisma.TransactionClient,
    id: string,
  ): Promise<void> {
    await tx.recommendation_log.delete({
      where: {
        id,
      },
    });
  }
}

