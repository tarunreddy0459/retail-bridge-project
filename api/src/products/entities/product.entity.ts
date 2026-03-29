import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Brand } from '../../brands/entities/brand.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  sku: string;

  @Column({ type: 'uuid' })
  categoryID: string;

  @ManyToOne(() => Category, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryID' })
  category: Category;

  @Column({ type: 'uuid' })
  brandID: string;

  @ManyToOne(() => Brand, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'brandID' })
  brand: Brand;

  @Column({ type: 'varchar', length: 50 })
  unit: string;

  @Column({ type: 'boolean', default: false })
  is_age_restricted: boolean;

  @Column({ type: 'boolean', default: false })
  isDisabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;
}
