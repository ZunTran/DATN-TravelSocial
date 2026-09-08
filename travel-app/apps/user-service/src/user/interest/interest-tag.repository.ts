import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';



@Injectable()
export class InterestTagRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}


  async findById(id: string) {
    return this.prisma.interest_tag.findUnique({where: { id }});
  }

  async findByIds(ids: string[]) {
  return this.prisma.interest_tag.findMany({where: {id: {in: ids}}});
}

  async findByName(name: string) {
    return this.prisma.interest_tag.findUnique({where: { name }});
  }

  async createTag(data: Prisma.interest_tagCreateInput) {
    return this.prisma.interest_tag.create({data});
  }

  async updateTag(id: string, data: Prisma.interest_tagUpdateInput) {
    return this.prisma.interest_tag.update({
      where: { id },
      data
    });
  }

  async deleteTag(id: string) {
    return this.prisma.interest_tag.delete({where: { id }});
  }

    async findAll() {
    return this.prisma.interest_tag.findMany({orderBy: { name: 'asc' }});
  }

  async findByProfileId(user_profile_id: string) {
    const userInterests = await this.prisma.user_interest.findMany({
      where: { user_id: user_profile_id },
      include: { interest_tag: true },
    });
    return userInterests.map((item) => item.interest_tag);
  }

  async findByProfileIdPaginated(user_profile_id: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [userInterests, total] = await Promise.all([
      this.prisma.user_interest.findMany({
        where: { user_id: user_profile_id },
        include: { interest_tag: true },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.user_interest.count({ where: { user_id: user_profile_id } })]);

    return {
      data: userInterests.map((item) => item.interest_tag),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)};
  }

  async updateUserInterests(user_profile_id: string, interestIds: string[]) {
    return this.prisma.$transaction(async (tx) => {
      await tx.user_interest.deleteMany({
        where: { user_id: user_profile_id },
      });

      if (interestIds.length > 0) {
        const dataToCreate = interestIds.map((interestId) => ({
          user_id: user_profile_id,
          interest_id: interestId,
        }));
        await tx.user_interest.createMany({
          data: dataToCreate,
          skipDuplicates: true,
        });
      }

      const updated = await tx.user_interest.findMany({
        where: { user_id: user_profile_id },
        include: { interest_tag: true },
      });
      return updated.map((item) => item.interest_tag);
    });
  }
  
  async search(name: string) {
    return this.prisma.interest_tag.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive'
        }},
      orderBy: {name: 'asc'},
      take: 20 
    });
  }


  async findUsersWithCommonInterests(
    user_profile_id: string,interestIds: string[],limit: number = 10,
  ) {
    if (interestIds.length === 0) return [];

    const matches = await this.prisma.user_profile.findMany({
      where: {
        id: {not: user_profile_id,},
        user_interests: {
          some: {interest_id: {in: interestIds},},
        }},
      take: limit,
      orderBy: {created_at: 'desc'},
    });

    return matches;
  }

  async findAllPaginated( page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where = search?.trim()
      ? { name: {
            contains: search.trim(),
            mode: 'insensitive' as const,
          }}
      : {};

    const [data, total] = await Promise.all([
        this.prisma.interest_tag.findMany({
          where,
          skip,
          take: limit,
          orderBy: { created_at: 'desc' },
        }),

        this.prisma.interest_tag.count({ where }),
      ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

}