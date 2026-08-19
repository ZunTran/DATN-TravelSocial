import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { HashtagRepository } from './hashtag.repository';
import { CreateHashtagInput } from './dto/create-hashtag.input';
import { UpdateHashtagInput } from './dto/update-hashtag.input';

@Injectable()
export class HashtagService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: HashtagRepository,
  ) {}

  async findAll() {
    return this.prisma.$transaction((tx) =>
      this.repository.findAll(tx),
    );
  }

  async create(
    input: CreateHashtagInput,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const name =
        input.name.trim().toLowerCase();

      const existing =
        await this.repository.findByName(
          tx,
          name,
        );

      if (existing) {
        throw new BadRequestException(
          'Hashtag already exists',
        );
      }

      return this.repository.create(
        tx,
        name,
      );
    });
  }

  async update(
    input: UpdateHashtagInput,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const hashtag =
        await this.repository.findById(
          tx,
          input.id,
        );

      if (!hashtag) {
        throw new NotFoundException(
          'Hashtag not found',
        );
      }

      const name =
        input.name.trim().toLowerCase();

      const duplicate =
        await this.repository.findByName(
          tx,
          name,
        );

      if (
        duplicate &&
        duplicate.id !== input.id
      ) {
        throw new BadRequestException(
          'Hashtag already exists',
        );
      }

      return this.repository.update(
        tx,
        input.id,
        name,
      );
    });
  }

  async delete(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const hashtag =
        await this.repository.findById(tx, id);

      if (!hashtag) {
        throw new NotFoundException(
          'Hashtag not found',
        );
      }

      await this.repository.delete(tx, id);

      return true;
    });
  }
}
