import {
  Args,
  Context,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';



import {
  GatewayCategoryObject,
  GatewayCategoryPageObject,
} from './types/category.types';
import { CategoryFilterInput, CreateCategoryInput, UpdateCategoryInput } from './dto/category.input';
import { CategoryGatewayService } from './category.gateway.service';

@Resolver()
export class CategoryGatewayResolver {
  constructor(
    private readonly categoryGatewayService: CategoryGatewayService,
  ) {}

  private getAuthorization(
    context: any,
  ): string | undefined {
    return context?.req?.headers?.authorization;
  }


  @Query(() => GatewayCategoryPageObject)
  categoryOptions(
    @Args('filter', {
      type: () => CategoryFilterInput,
      nullable: true,
    })
    filter?: CategoryFilterInput,
  ) {
    return this.categoryGatewayService.categoryOptions(
      filter ?? {
        page: 1,
        limit: 20,
      },
    );
  }

  @Query(() => [GatewayCategoryObject])
  categories() {
    return this.categoryGatewayService.categories();
  }

  @Mutation(() => GatewayCategoryObject)
  createCategory(
    @Args('input') input: CreateCategoryInput,
    @Context() context: any,
  ) {
    return this.categoryGatewayService.createCategory(
      input,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => GatewayCategoryObject)
  updateCategory(
    @Args('input') input: UpdateCategoryInput,
    @Context() context: any,
  ) {
    return this.categoryGatewayService.updateCategory(
      input,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => Boolean)
  deleteCategory(
    @Args('id', {
      type: () => ID,
    })
    id: string,
    @Context() context: any,
  ) {
    return this.categoryGatewayService.deleteCategory(
      id,
      this.getAuthorization(context),
    );
  }
}