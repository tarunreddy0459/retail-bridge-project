import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateNested,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

class LicenseDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  licenseType: string;

  @IsString()
  @IsNotEmpty()
  expiryDate: string;

  @IsString()
  @IsNotEmpty()
  document: string;
}

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LicenseDto)
  licenses?: LicenseDto[];

  @IsString()
  @IsOptional()
  storeEmail?: string;

  @IsString()
  @IsOptional()
  storeMobile?: string;

  @IsString()
  @IsOptional()
  assignedTo?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsUUID()
  @IsOptional()
  createdById?: string;

  @IsUUID()
  @IsOptional()
  updatedById?: string;
}
