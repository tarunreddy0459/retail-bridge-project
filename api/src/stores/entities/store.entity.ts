import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/users.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 150 })
  type: string;

  @Column({ type: 'text' })
  address: string;

  // The user this store belongs to
  @Column({ type: 'uuid' })
  userId: string;
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'json', nullable: true })
  licenses: {
    id: string;
    licenseType: string;
    expiryDate: string;
    document: string;
  }[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  storeEmail: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  storeMobile: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  assignedTo: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  createdById: string;
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ type: 'uuid', nullable: true })
  updatedById: string;
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updatedById' })
  updatedBy: User;
}
