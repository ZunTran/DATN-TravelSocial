import { InputType, Field, registerEnumType} from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ProviderType } from '@prisma/client';

registerEnumType(ProviderType, {
  name: 'ProviderType', // hiển thị trên GraphQL Schema
  description: 'Các nhà cung cấp đăng nhập mạng xã hội',
});

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