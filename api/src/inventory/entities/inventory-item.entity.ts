import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Inventory } from './inventory.entity';
import { Product } from '../../products/entities/product.entity';

export enum QuantityType {
  COTTON = 'cotton',
  CASE = 'case',
  SINGLE = 'single',
}

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  inventoryId: string;

  @ManyToOne(() => Inventory, (inventory) => inventory.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'inventoryId' })
  inventory: Inventory;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'varchar', length: 255 })
  sku: string;

  @Column({
    type: 'enum',
    enum: QuantityType,
    default: QuantityType.SINGLE,
  })
  quantityType: QuantityType;

  @Column({ type: 'int', nullable: true })
  noOfPacks: number;

  @Column({ type: 'int', nullable: true })
  noOfUnits: number;

  @Column({ type: 'int' })
  on_hand_qty: number;

  @Column({ type: 'int', default: 0 })
  reorderLevel: number;
}
