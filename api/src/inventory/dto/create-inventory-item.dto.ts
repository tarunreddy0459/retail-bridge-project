import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { QuantityType } from '../entities/inventory-item.entity';

export class CreateInventoryItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsEnum(QuantityType)
  @IsNotEmpty()
  quantityType: QuantityType;

  @IsNumber()
  @IsOptional()
  @Min(0)
  noOfPacks?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  noOfUnits?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  quantity?: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  reorderLevel: number;
}
