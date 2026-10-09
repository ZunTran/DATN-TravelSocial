import { Injectable } from '@nestjs/common';
import { SocialGraphqlClient } from '../../clients/social-graphql.client';
import { GatewayCategoryObject, GatewayCategoryPageObject} from './types/category.types';
import { CategoryFilterInput, CreateCategoryInput, UpdateCategoryInput } from './dto/category.input';
import { ADMIN_CREATE_CATEGORY_MUTATION, ADMIN_DELETE_CATEGORY_MUTATION, ADMIN_UPDATE_CATEGORY_MUTATION, CATEGORIES_QUERY, CATEGORY_OPTIONS_QUERY } from './category.queries';

interface CategoryPageResponse {
  categoryOptions: GatewayCategoryPageObject;
}

interface CategoriesResponse {
  categories: GatewayCategoryObject[];
}

interface CreateCategoryResponse {
  createCategory: GatewayCategoryObject;
}

interface UpdateCategoryResponse {
  updateCategory: GatewayCategoryObject;
}

interface DeleteCategoryResponse {
  deleteCategory: boolean;
}

@Injectable()
export class CategoryGatewayService {
  constructor(
    private readonly socialClient: SocialGraphqlClient,
  ) {}

async categoryOptions( filter: CategoryFilterInput, authorization?: string): Promise<GatewayCategoryPageObject> {
  const data = await this.socialClient.execute<CategoryPageResponse>(
      CATEGORY_OPTIONS_QUERY,
      { filter },
      authorization,
    );

  return data.categoryOptions;
}
  //API cũ.

  async categories(): Promise<GatewayCategoryObject[]> {
    const data = await this.socialClient.execute<CategoriesResponse>(CATEGORIES_QUERY,);
    return data.categories;
  }

  async createCategory(
    input: CreateCategoryInput,
    authorization?: string,
  ): Promise<GatewayCategoryObject> {
    const data =
      await this.socialClient.execute<CreateCategoryResponse>(
        ADMIN_CREATE_CATEGORY_MUTATION,
        { input },
        authorization,
      );

    return data.createCategory;
  }

  async updateCategory(
    input: UpdateCategoryInput,
    authorization?: string,
  ): Promise<GatewayCategoryObject> {
    const data =
      await this.socialClient.execute<UpdateCategoryResponse>(
        ADMIN_UPDATE_CATEGORY_MUTATION,
        {
          input,
        },
        authorization,
      );

    return data.updateCategory;
  }

  async deleteCategory(
    id: string,
    authorization?: string,
  ): Promise<boolean> {
    const data =
      await this.socialClient.execute<DeleteCategoryResponse>(
        ADMIN_DELETE_CATEGORY_MUTATION,
        {
          id,
        },
        authorization,
      );

    return data.deleteCategory;
  }
}