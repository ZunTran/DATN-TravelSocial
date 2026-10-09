import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HashtagGatewayService } from './hashtag.gateway.service';
import { AdminHashtagListObject, HashtagObject, HashtagPageObject } from './types/hashtag.object';
import { AdminHashtagFilterInput, CreateHashtagInput, HashtagFilterInput, UpdateHashtagInput } from './dto/hashtag.input';

@Resolver()
export class HashtagGatewayResolver {
  constructor(
    private readonly hashtagGatewayService: HashtagGatewayService,
  ) {}

  private getAuthorization(
    context: any,
  ): string | undefined {
    return context?.req?.headers?.authorization;
  }

  @Query(() => HashtagPageObject)
  async hashtagOptions(
    @Args('filter', {
      type: () => HashtagFilterInput,
      nullable: true,
    })
    filter?: HashtagFilterInput,

    @Context() context?: any,
  ) {
    return this.hashtagGatewayService.hashtagOptions(
      filter ?? {
        page: 1,
        limit: 20,
      },
      this.getAuthorization(context),
    );
  }

  @Query(() => [HashtagObject])
  hashtags() {
    return this.hashtagGatewayService.hashtags();
  }

  @Mutation(() => HashtagObject)
  createHashtag(
    @Args('input', {
      type: () => CreateHashtagInput,
    })
    input: CreateHashtagInput,

    @Context() context: any,
  ) {
    return this.hashtagGatewayService.createHashtag(
      input,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => HashtagObject)
  updateHashtag(
    @Args('input', {
      type: () => UpdateHashtagInput,
    })
    input: UpdateHashtagInput,

    @Context() context: any,
  ) {
    return this.hashtagGatewayService.updateHashtag(
      input,
      this.getAuthorization(context),
    );
  }

  @Query(() => AdminHashtagListObject)
  adminHashtags(
    @Args('filter', {
      type: () => AdminHashtagFilterInput,
      nullable: true,
    })
    filter?: AdminHashtagFilterInput,

    @Context() context?: any,
  ) {
    return this.hashtagGatewayService.adminHashtags(
      filter ?? {
        page: 1,
        limit: 20,
      },
      this.getAuthorization(context),
    );
  }

  @Mutation(() => Boolean)
  adminDeleteHashtag(
    @Args('id', {
      type: () => ID,
    })
    id: string,

    @Context() context?: any,
  ) {
    return this.hashtagGatewayService.adminDeleteHashtag(
      id,
      this.getAuthorization(context),
    );
  }
}