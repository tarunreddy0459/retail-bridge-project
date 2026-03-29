import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { InventoryItem } from './inventory-item.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  storeId: string;

  @ManyToOne(() => Store, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  @OneToMany(() => InventoryItem, (item) => item.inventory, { cascade: true })
  items: InventoryItem[];
}
