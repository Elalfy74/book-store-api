import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsMobilePhone,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @Transform((email) => email.value.toLowerCase())
  email: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(2, 50)
  name: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6, 225)
  password: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsMobilePhone('ar-EG')
  @IsOptional()
  phone: string;
}
