import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsUUID()
  @IsNotEmpty()
  categoryID: string;

  @IsUUID()
  @IsNotEmpty()
  brandID: string;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsBoolean()
  @IsOptional()
  is_age_restricted?: boolean;

  @IsUUID()
  @IsOptional()
  createdBy?: string;

  @IsUUID()
  @IsOptional()
  updatedBy?: string;
}
