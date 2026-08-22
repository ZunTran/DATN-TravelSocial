import { Injectable, NotFoundException} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRecommendationLogInput } from './dto/create-recommendation-log.input';
import { PaginationInput } from '../../common/dto/pagination.input';
import { RecommendationLogList } from './objects/recommendation-list.object';
import { RecommendationLogRepository } from './recommendation.repository';
import { RecommendationLogRecord } from './types/Recommendation.type';
import { UserProfileClient } from '../../common/clients/user-profile/user-profile.client';
import { RecommendationLogObject } from './objects/recommendation.object';

@Injectable()
export class RecommendationLogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: RecommendationLogRepository,
    private readonly userProfileClient: UserProfileClient,

  ) {}

  private mapLog(log: RecommendationLogRecord) {
    return {
      id: log.id,
      userId: log.user_id,
      type: log.type,
      referenceId: log.reference_id,
      score: log.score,
      createdAt: log.created_at,
    };
  }

    private async getUserId( accountId: string): Promise<string> {
        const profile = await this.userProfileClient.getByAccountId(accountId);
        if (!profile) 
            throw new NotFoundException(' User profile not found');
        return profile.profileId;
    }


   async create( accountId: string, input: CreateRecommendationLogInput ): Promise<RecommendationLogObject> {
    const userId = await this.getUserId(accountId);

    return this.prisma.$transaction(
      async (tx) => {
        const log = await this.repository.create(
            tx,
            {
              userId,
              type: input.type,
              referenceId: input.referenceId,
              score: input.score,
            },
          );

        return this.mapLog(log);
      },
    );
  }


  async findById( accountId: string, id: string): Promise<RecommendationLogObject>  {
    const userId = await this.getUserId(accountId);
    const log = await this.repository.findById(id);
    if ( !log || log.user_id !== userId    ) 
      throw new NotFoundException(' Recommendation log not found');

    return this.mapLog(log);
  }

  async findMany( accountId: string, pagination: PaginationInput): Promise<RecommendationLogList> {
    const userId = await this.getUserId(accountId);

    const page = Math.max( 1, pagination?.page ?? 1);
    const limit = Math.min( Math.max(1, pagination?.limit ?? 20 ), 100 );
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([ 
        this.repository.findByUser( userId, skip, limit),
        this.repository.countByUser( userId ),
      ]);

    return {
      items: items.map((item) =>
        this.mapLog(item),
      ),
      total,
      page,
      limit,
      totalPages: Math.ceil( total / limit),
    };
  }

  async delete( accountId: string, id: string ): Promise<boolean>{
    const userId = await this.getUserId(accountId);
    const log = await this.repository.findById(id);

    if (!log || log.user_id !== userId) 
      throw new NotFoundException(' Recommendation log not found' );
    
    await this.prisma.$transaction(
      async (tx) => {
        await this.repository.delete( tx, id);
      },
    );

    return true;
  }
}
