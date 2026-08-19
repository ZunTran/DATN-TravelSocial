import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class LocationRepository {
  async findById(
    tx: Prisma.TransactionClient,
    id: string,
  ) {
    return tx.location.findUnique({
      where: { id },
    });
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
      where: { id },
      data,
    });
  }

  async delete(
    tx: Prisma.TransactionClient,
    id: string,
  ) {
    return tx.location.delete({
      where: { id },
    });
  }

}