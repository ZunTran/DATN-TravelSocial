import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsNotEmpty({ message: 'Token không được trống!' })
  token: string;

  @Field()
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' })
  password: string;
}