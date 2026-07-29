import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: 'Email không đúng định dạng!' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống!' })
  password: string;
}