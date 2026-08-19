import {  BadRequestException,  Injectable,  NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { LocationRepository } from './location.repository';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';

@Injectable()
export class LocationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: LocationRepository,
  ) {}

  async findAll() {
    return this.prisma.$transaction((tx) =>
      this.repository.findAll(tx),
    );
  }

  async create(input: CreateLocationInput) {
    return this.prisma.$transaction(async (tx) => {
      const name = input.name.trim();

      if (!name) {
        throw new BadRequestException(
          'Location name is required',
        );
      }

      const existing = await tx.location.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          },
          province: input.province?.trim() ?? null,
        },
      });

      if (existing) {
        throw new BadRequestException(
          'Location already exists',
        );
      }

      return this.repository.create(tx, {
        name,
        address: input.address?.trim() ?? null,
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
        province: input.province?.trim() ?? null,
      });
    });
  }


  async update(input: UpdateLocationInput) {
    return this.prisma.$transaction(async (tx) => {
      const location =
        await this.repository.findById(
          tx,
          input.id,
        );

      if (!location) {
        throw new NotFoundException(
          'Location not found',
        );
      }

      const name = input.name.trim();

      if (!name) {
        throw new BadRequestException(
          'Location name is required',
        );
      }

      const province =
        input.province?.trim() ?? null;

      const duplicate = await tx.location.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          },
          province,
          NOT: {
            id: input.id,
          },
        },
      });

      if (duplicate) {
        throw new BadRequestException(
          'Location already exists',
        );
      }

      return this.repository.update(
        tx,
        input.id,
        {
          name,
          address: input.address?.trim() ?? null,
          latitude: input.latitude ?? null,
          longitude: input.longitude ?? null,
          province,
        },
      );
    });
  }


  async delete(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const location =
        await this.repository.findById(tx, id);

      if (!location) {
        throw new NotFoundException(
          'Location not found',
        );
      }
      await this.repository.delete(tx, id);

      return true;
    });
  }
}