import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';



@Injectable()
export class InterestTagRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    data: Prisma.interest_tagCreateInput,
  ) {
    return this.prisma.interest_tag.create({
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.interest_tag.findUnique({
      where: { id },
    });
  }

  async findByName(name: string) {
    return this.prisma.interest_tag.findUnique({
      where: { name },
    });
  }

  async findAll() {
    return this.prisma.interest_tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async search(name: string) {
    return this.prisma.interest_tag.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
      take: 20,
    });
  }

  async update(
    id: string,
    data: Prisma.interest_tagUpdateInput,
  ) {
    return this.prisma.interest_tag.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.interest_tag.delete({
      where: { id },
    });
  }
}