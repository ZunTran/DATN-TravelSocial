import { Injectable } from '@nestjs/common';
import { SocialGraphqlClient } from '../../clients/social-graphql.client';
import { GatewayCategoryObject, GatewayCategoryPageObject} from './types/category.types';
import { CategoryFilterInput, CreateCategoryInput, UpdateCategoryInput } from './dto/category.input';

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

  /**
   * Category dùng cho Create/Edit Post.
   * Có pagination + search.
   */
  async categoryOptions(
    filter: CategoryFilterInput,
  ): Promise<GatewayCategoryPageObject> {
    const data =
      await this.socialClient.execute<CategoryPageResponse>(
        `
        query CategoryOptions(
          $filter: CategoryFilterInput
        ) {
          categoryOptions(filter: $filter) {
            items {
              id
              name
              description
            }
            total
            page
            limit
            totalPages
            hasNextPage
          }
        }
        `,
        {
          filter,
        },
      );

    return data.categoryOptions;
  }

  /**
   * API cũ.
   */
  async categories(): Promise<GatewayCategoryObject[]> {
    const data =
      await this.socialClient.execute<CategoriesResponse>(
        `
        query Categories {
          categories {
            id
            name
            description
          }
        }
        `,
      );

    return data.categories;
  }

  async createCategory(
    input: CreateCategoryInput,
    authorization?: string,
  ): Promise<GatewayCategoryObject> {
    const data =
      await this.socialClient.execute<CreateCategoryResponse>(
        `
        mutation CreateCategory(
          $input: CreateCategoryInput!
        ) {
          createCategory(input: $input) {
            id
            name
            description
          }
        }
        `,
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
        `
        mutation UpdateCategory(
          $input: UpdateCategoryInput!
        ) {
          updateCategory(input: $input) {
            id
            name
            description
          }
        }
        `,
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
        `
        mutation DeleteCategory(
          $id: ID!
        ) {
          deleteCategory(id: $id)
        }
        `,
        {
          id,
        },
        authorization,
      );

    return data.deleteCategory;
  }
}