import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateSuperAdminResponseDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  phoneNumber: string;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
