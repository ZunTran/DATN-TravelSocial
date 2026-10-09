import { Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { CategoryService } from './category.service';
import { CategoryObject } from './objects/category.object';
import { CategoryPageObject } from './objects/category-page.object';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { CategoryFilterInput } from './dto/category-filter.input';
import { JwtAuthGuard } from '../../../common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/auth/guards/roles.guard';
import { Roles } from '../../../common/auth/decorators/roles.decorator';

@Resolver(() => CategoryObject)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  @Query(() => CategoryPageObject)
  async categoryOptions(
    @Args('filter', {
      type: () => CategoryFilterInput,
      nullable: true,
    })
    filter?: CategoryFilterInput,
  ) {
    return this.categoryService.getPaginated(
      filter ?? {
        page: 1,
        limit: 20,
      },
    );
  }

  @Query(() => [CategoryObject])
  async categories() {
    return this.categoryService.findAll();
  }

  @Mutation(() => CategoryObject)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createCategory(
    @Args('input') input: CreateCategoryInput,
  ) {
    return this.categoryService.create(input);
  }

  @Mutation(() => CategoryObject)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateCategory(
    @Args('input') input: UpdateCategoryInput,
  ) {
    return this.categoryService.update(input);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteCategory(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.categoryService.delete(id);
  }
}