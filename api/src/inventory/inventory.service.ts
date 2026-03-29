import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { InventoryItem, QuantityType } from './entities/inventory-item.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    const { items, ...inventoryData } = createInventoryDto;

    const inventory = this.inventoryRepository.create({
      ...inventoryData,
      items: items.map((itemDto) => {
        const on_hand_qty = this.calculateOnHandQty(itemDto);
        return this.inventoryItemRepository.create({
          ...itemDto,
          on_hand_qty,
        });
      }),
    });

    return await this.inventoryRepository.save(inventory);
  }

  async findAll(): Promise<Inventory[]> {
    return await this.inventoryRepository.find({
      relations: ['items', 'store', 'items.product'],
    });
  }

  async findOne(id: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['items', 'store', 'items.product'],
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID "${id}" not found`);
    }

    return inventory;
  }

  async update(
    id: string,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    const inventory = await this.findOne(id);
    const { items, ...inventoryData } = updateInventoryDto;

    // Update basic inventory fields
    Object.assign(inventory, inventoryData);

    if (items) {
      // For simplicity in this implementation, we replace the items.
      // In a more complex scenario, you might want to reconcile (update/delete/add).
      inventory.items = items.map((itemDto) => {
        const on_hand_qty = this.calculateOnHandQty(itemDto as CreateInventoryItemDto);
        return this.inventoryItemRepository.create({
          ...itemDto,
          on_hand_qty,
        });
      });
    }

    return await this.inventoryRepository.save(inventory);
  }

  async remove(id: string): Promise<void> {
    const inventory = await this.findOne(id);
    await this.inventoryRepository.remove(inventory);
  }

  private calculateOnHandQty(item: CreateInventoryItemDto): number {
    if (item.quantityType === QuantityType.SINGLE) {
      return item.quantity || 0;
    } else if (
      item.quantityType === QuantityType.CASE ||
      item.quantityType === QuantityType.COTTON
    ) {
      return (item.noOfPacks || 0) * (item.noOfUnits || 0);
    }
    return 0;
  }
}
