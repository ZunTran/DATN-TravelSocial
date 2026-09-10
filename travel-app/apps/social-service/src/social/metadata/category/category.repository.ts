import { Injectable } from '@nestjs/common';
import { Prisma,  } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CategoryRepository {
  async findById(tx: Prisma.TransactionClient,
    id: string ) {
    return tx.category.findUnique({where: { id }});
  }

  async exists(tx: Prisma.TransactionClient,id: string,): Promise<boolean> {
  const category = await tx.category.findUnique({
    where: { id },
    select: { id: true },
  });
  return !!category;
  }

   async findAll(
    tx: Prisma.TransactionClient,
  ) {
    return tx.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }


  async findByName(
    tx: Prisma.TransactionClient,
    name: string,
  ) {
    return tx.category.findUnique({
      where: { name },
    });
  }

  async create(
    tx: Prisma.TransactionClient,
    name: string,
    description: string | null,
  ) {
    return tx.category.create({
      data: {
        name,
        description,
      },
    });
  }

  async update(
    tx: Prisma.TransactionClient,
    id: string,
    name: string,
    description: string | null,
  ) {
    return tx.category.update({
      where: { id },
      data: {
        name,
        description,
      },
    });
  }

  async delete(
    tx: Prisma.TransactionClient,
    id: string,
  ) {
    return tx.category.delete({
      where: { id },
    });
  }

  async findMany(
    tx: Prisma.TransactionClient | PrismaService,
    options: {
      search?: string;
      skip: number;
      take: number;
    },
  ) {
    return tx.category.findMany({
      where: options.search
        ? {
            name: {
              contains: options.search,
              mode: 'insensitive',
            },
          }
        : undefined,

      orderBy: {
        name: 'asc',
      },

      skip: options.skip,
      take: options.take,
    });
  }

  async count(
    tx: Prisma.TransactionClient | PrismaService,
    search?: string,
  ) {
    return tx.category.count({
      where: search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : undefined,
    });
  }

}