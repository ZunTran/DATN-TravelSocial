import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class LocationRepository {
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