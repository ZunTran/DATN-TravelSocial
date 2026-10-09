import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { EmbeddingService } from './embedding.service';
import { HybridLocationSearchInput } from './dto/hybrid-location-search.input';

@Injectable()
export class LocationRepository {
   constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async hybridSearch(input: HybridLocationSearchInput) {
  const embedding = await this.embeddingService.embed(input.query);
  console.log('[Repository] EMBEDDING DONE');
  const vector = `[${embedding.join(',')}]`;

  const provinceCondition = input.province
    ? Prisma.sql`AND l.province = ${input.province}`
    : Prisma.empty;

  const categoryCondition = input.category
    ? Prisma.sql`AND c.name = ${input.category}`
    : Prisma.empty;

  const minCostCondition =
    input.minCost !== undefined
      ? Prisma.sql`AND l.estimated_cost >= ${input.minCost}`
      : Prisma.empty;

  const maxCostCondition =
    input.maxCost !== undefined
      ? Prisma.sql`AND l.estimated_cost <= ${input.maxCost}`
      : Prisma.empty;

  const minDurationCondition =
    input.minDuration !== undefined
      ? Prisma.sql`AND l.duration_minutes >= ${input.minDuration}`
      : Prisma.empty;

  const maxDurationCondition =
    input.maxDuration !== undefined
      ? Prisma.sql`AND l.duration_minutes <= ${input.maxDuration}`
      : Prisma.empty;

  const limit = input.limit ?? 10;

  const rows = await this.prisma.$queryRaw<any[]>(
    Prisma.sql`
      SELECT
        l.id AS "locationId",
        l.name,
        l.address,
        l.description,
        c.name AS category,
        l.province,
        l.estimated_cost AS "estimatedCost",
        l.duration_minutes AS "durationMinutes",
        l.opening_hours AS "openingHours",
        l.latitude,
        l.longitude,

        1 - (
          le.embedding <=> ${vector}::vector
        ) AS similarity

      FROM location_embedding le

      INNER JOIN location l
        ON l.id = le.location_id

      LEFT JOIN category c
        ON c.id = l.category_id

      WHERE 1 = 1

      ${provinceCondition}
      ${categoryCondition}
      ${minCostCondition}
      ${maxCostCondition}
      ${minDurationCondition}
      ${maxDurationCondition}

      ORDER BY le.embedding <=> ${vector}::vector

      LIMIT ${limit}
    `,
  );

  return rows;
}

  async findById(
    tx: Prisma.TransactionClient,
    id: string,
  ) {
    return tx.location.findUnique({
      where: {
        id,
      },
    });
  }

  async findPage(
    tx: Prisma.TransactionClient,
    options: {
      search?: string;
      province?: string;
      page: number;
      limit: number;
    },
  ) {
    const {
      search,
      province,
      page,
      limit,
    } = options;

    const where: Prisma.locationWhereInput = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          address: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          province: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (province) {
      where.province = {
        equals: province,
        mode: 'insensitive',
      };
    }

    const skip = (page - 1) * limit;

    const [
      items,
      total,
    ] = await Promise.all([
      tx.location.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          {
            province: 'asc',
          },
          {
            name: 'asc',
          },
        ],
      }),

      tx.location.count({
        where,
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
    };
  }

  async findAll(
    tx: Prisma.TransactionClient,
  ) {
    return tx.location.findMany({
      orderBy: [
        {
          province: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    });
  }

  async create(
    tx: Prisma.TransactionClient,
    data: {
      name: string;
      address: string | null;
      latitude: number | null;
      longitude: number | null;
      province: string | null;
    },
  ) {
    return tx.location.create({
      data: {
        name: data.name,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        province: data.province,
      },
    });
  }

  async update(
    tx: Prisma.TransactionClient,
    id: string,
    data: {
      name: string;
      address: string | null;
      latitude: number | null;
      longitude: number | null;
      province: string | null;
    },
  ) {
    return tx.location.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(
    tx: Prisma.TransactionClient,
    id: string,
  ) {
    return tx.location.delete({
      where: {
        id,
      },
    });
  }
}