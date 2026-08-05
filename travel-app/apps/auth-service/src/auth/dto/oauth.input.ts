import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ProviderType } from '@prisma/client';

@InputType()
export class OauthLoginInput {
  @Field(() => ProviderType)
  provider: ProviderType;

  @Field()
  @IsNotEmpty({ message: 'Provider User ID không được để trống!' })
  providerUserId: string;

  @Field()
  @IsNotEmpty({ message: 'Email không được để trống!' })
  email: string;
}