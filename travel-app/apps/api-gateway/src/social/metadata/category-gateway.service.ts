import { Injectable} from '@nestjs/common';
import {SocialGraphqlClient} from '../clients/social-graphql.client';
import { CategoryObject } from '@nestjs/graphql';
import { CreateCategoryInput, UpdateCategoryInput } from './dto/metadata.inputs';

interface CategoriesResponse {
  categories: CategoryObject[];
}

interface CreateCategoryResponse {
  createCategory: CategoryObject;
}

interface UpdateCategoryResponse {
  updateCategory: CategoryObject;
}

@Injectable()
export class CategoryGatewayService {
  constructor(
    private readonly socialClient: SocialGraphqlClient,
  ) {}

  async categories(): Promise<
    CategoryObject[]
  > {
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
  ): Promise<CategoryObject> {
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
  ): Promise<CategoryObject> {
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
        { input },
        authorization,
      );

    return data.updateCategory;
  }
}