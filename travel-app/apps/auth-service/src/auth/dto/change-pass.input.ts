import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống!' })
  oldPassword: string;

  @Field()
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' })
  newPassword: string;
}