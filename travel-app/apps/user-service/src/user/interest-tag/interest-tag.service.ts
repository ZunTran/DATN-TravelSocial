import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InterestTagRepository } from './interest-tag.repository';

import { CreateInterestTagInput } from './dto/create-interest-tag.input';
import { UpdateInterestTagInput } from './dto/update-interest-tag.input';

@Injectable()
export class InterestTagService {
  constructor(
    private readonly repository: InterestTagRepository,
  ) {}

  async create(
    input: CreateInterestTagInput,
  ) {
    const existed =
      await this.repository.findByName(
        input.name,
      );

    if (existed) {
      throw new ConflictException(
        'Interest tag đã tồn tại',
      );
    }

    return this.repository.create({
      name: input.name,
      icon_url: input.icon_url,
    });
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const tag =
      await this.repository.findById(id);

    if (!tag) {
      throw new NotFoundException(
        'Không tìm thấy interest tag',
      );
    }

    return tag;
  }

  async search(name: string) {
    return this.repository.search(name);
  }

  async update(
    id: string,
    input: UpdateInterestTagInput,
  ) {
    await this.findOne(id);

    if (input.name) {
      const existed =
        await this.repository.findByName(
          input.name,
        );

      if (existed && existed.id !== id) {
        throw new ConflictException(
          'Interest tag đã tồn tại',
        );
      }
    }

    return this.repository.update(id, {
      name: input.name,
      icon_url: input.icon_url,
    });
  }

  async delete(id: string) {
    await this.findOne(id);

    return this.repository.delete(id);
  }
}