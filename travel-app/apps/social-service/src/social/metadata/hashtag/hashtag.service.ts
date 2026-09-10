import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { HashtagRepository } from './hashtag.repository';
import { CreateHashtagInput } from './dto/create-hashtag.input';
import { UpdateHashtagInput } from './dto/update-hashtag.input';
import { AdminHashtagFilterInput } from './dto/admin-hashtag.input';

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

  async create( input: CreateHashtagInput ) {
    return this.prisma.$transaction(async (tx) => {
      const name = this.normalizeName(input.name);
      const existing = await this.repository.findByName( tx, name);
      if (existing) 
        throw new BadRequestException('Hashtag already exists');
      
      return this.repository.create( tx, name );
    });
  }

  async update( input: UpdateHashtagInput) {
    return this.prisma.$transaction(async (tx) => {
      const hashtag = await this.repository.findById(
          tx,
          input.id,
        );

      if (!hashtag) 
        throw new NotFoundException('Hashtag not found');

      const name =input.name.trim().toLowerCase();
      const duplicate = await this.repository.findByName( tx, name);

      if ( duplicate && duplicate.id !== input.id) {
        throw new BadRequestException('Hashtag already exists' );
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
      const hashtag =await this.repository.findById(tx, id);
      if (!hashtag) 
        throw new NotFoundException('Hashtag not found');

      await this.repository.delete(tx, id);

      return true;
    });
  }

  async adminGetHashtags( filter: AdminHashtagFilterInput) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.repository.adminFindMany(this.prisma, {
        search: filter.search,
        skip,
        take: limit,
      }),

      this.repository.adminCount(
        this.prisma,
        filter.search,
      ),
    ]);

    return {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        postCount: item._count.posts,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private normalizeName(name: string) {
    return name
      .trim()
      .replace(/^#/, '')
      .toLowerCase();
  }

}
