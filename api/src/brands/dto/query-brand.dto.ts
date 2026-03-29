import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class QueryBrandDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isDisabled?: boolean;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
