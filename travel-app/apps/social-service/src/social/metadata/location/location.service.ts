import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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

  private mapLocation(location: any) {
    return {
      ...location,
      latitude:
        location.latitude === null
          ? null
          : Number(location.latitude),

      longitude:
        location.longitude === null
          ? null
          : Number(location.longitude),
    };
  }

  async findPage(input: {
    search?: string;
    province?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(
      1,
      input.page ?? 1,
    );

    const limit = Math.min(
      50,
      Math.max(
        1,
        input.limit ?? 20,
      ),
    );

    const search =
      input.search?.trim() || undefined;

    const province =
      input.province?.trim() || undefined;

    return this.prisma.$transaction(
      async (tx) => {
        const result =
          await this.repository.findPage(
            tx,
            {
              search,
              province,
              page,
              limit,
            },
          );

        return {
          ...result,

          items: result.items.map(
            (location) =>
              this.mapLocation(location),
          ),
        };
      },
    );
  }

  async findAll() {
    return this.prisma.$transaction(
      async (tx) => {
        const locations =
          await this.repository.findAll(tx);

        return locations.map(
          (location) =>
            this.mapLocation(location),
        );
      },
    );
  }

  async create(
    input: CreateLocationInput,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        const name =
          input.name.trim();

        if (!name) {
          throw new BadRequestException(
            'Location name is required',
          );
        }

        const existing =
          await tx.location.findFirst({
            where: {
              name: {
                equals: name,
                mode: 'insensitive',
              },
            },
          });

        if (existing) {
          throw new BadRequestException(
            'Location already exists',
          );
        }

        const location =
          await this.repository.create(
            tx,
            {
              name,

              address:
                input.address
                  ?.trim() ?? null,

              latitude:
                input.latitude ?? null,

              longitude:
                input.longitude ?? null,

              province:
                input.province
                  ?.trim() ?? null,
            },
          );

        return this.mapLocation(
          location,
        );
      },
    );
  }

  async update(
    input: UpdateLocationInput,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
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

        const name =
          input.name.trim();

        if (!name) {
          throw new BadRequestException(
            'Location name is required',
          );
        }

        const duplicate =
          await tx.location.findFirst({
            where: {
              name: {
                equals: name,
                mode: 'insensitive',
              },

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

        const updated =
          await this.repository.update(
            tx,
            input.id,
            {
              name,

              address:
                input.address
                  ?.trim() ?? null,

              latitude:
                input.latitude ?? null,

              longitude:
                input.longitude ?? null,

              province:
                input.province
                  ?.trim() ?? null,
            },
          );

        return this.mapLocation(
          updated,
        );
      },
    );
  }

  async delete(id: string) {
    return this.prisma.$transaction(
      async (tx) => {
        const location =
          await this.repository.findById(
            tx,
            id,
          );

        if (!location) {
          throw new NotFoundException(
            'Location not found',
          );
        }

        await this.repository.delete(
          tx,
          id,
        );

        return true;
      },
    );
  }
}