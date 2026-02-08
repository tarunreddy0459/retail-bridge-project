import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsInt,
} from 'class-validator';
import { UserStatus } from '../users.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  // IDs of who is creating/updating (coming from request/user session)
  @IsOptional()
  @IsInt()
  createdById?: number;

  @IsOptional()
  @IsInt()
  updatedById?: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // if you want password update in same endpoint, keep it optional
  @IsOptional()
  @IsString()
  @IsStrongPassword()
  password?: string;
}
