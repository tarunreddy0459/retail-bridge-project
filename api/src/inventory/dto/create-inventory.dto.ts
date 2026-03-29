import {
  IsUUID,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateInventoryItemDto } from './create-inventory-item.dto';

export class CreateInventoryDto {
  @IsUUID()
  @IsNotEmpty()
  storeId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInventoryItemDto)
  items: CreateInventoryItemDto[];

  @IsUUID()
  @IsOptional()
  createdBy?: string;

  @IsUUID()
  @IsOptional()
  updatedBy?: string;
}
