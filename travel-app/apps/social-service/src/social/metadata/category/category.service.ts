import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CategoryRepository } from './category.repository';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { CategoryFilterInput } from './dto/category-filter.input';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: CategoryRepository,
  ) {}

  async findAll() {
    return this.prisma.$transaction((tx) =>
      this.repository.findAll(tx),
    );
  }

  async create(input: CreateCategoryInput) {
    return this.prisma.$transaction(async (tx) => {
      const name = input.name.trim();

      const existing =
        await this.repository.findByName(
          tx,
          name,
        );

      if (existing) {
        throw new BadRequestException(
          'Category already exists',
        );
      }

      return this.repository.create(
        tx,
        name,
        input.description?.trim() ?? null,
      );
    });
  }

  async update(input: UpdateCategoryInput) {
    return this.prisma.$transaction(async (tx) => {
      const category =
        await this.repository.findById(
          tx,
          input.id,
        );

      if (!category) {
        throw new NotFoundException(
          'Category not found',
        );
      }

      const duplicate =
        await this.repository.findByName(
          tx,
          input.name.trim(),
        );

      if (
        duplicate &&
        duplicate.id !== input.id
      ) {
        throw new BadRequestException(
          'Category name already exists',
        );
      }

      return this.repository.update(
        tx,
        input.id,
        input.name.trim(),
        input.description?.trim() ?? null,
      );
    });
  }

  async delete(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const category =
        await this.repository.findById(tx, id);

      if (!category) {
        throw new NotFoundException(
          'Category not found',
        );
      }

      await this.repository.delete(tx, id);

      return true;
    });
  }


  async getPaginated(filter: CategoryFilterInput) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;

    const skip = (page - 1) * limit;

    const search = filter.search?.trim() || undefined;

    const [items, total] = await Promise.all([
      this.repository.findMany(this.prisma, {
        search,
        skip,
        take: limit,
      }),

      this.repository.count(
        this.prisma,
        search,
      ),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
    };
  }
}
