import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  // Index,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum UserType {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  RETAILER = 'retailer',
}
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  // @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false }) // select:false so it won't come by default
  password: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  mobile?: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.SUPER_ADMIN })
  type: UserType;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'varchar', length: 150, nullable: true })
  assignedTo?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // createdBy / updatedBy as ids who created/updated (self reference)
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  createdBy?: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updatedBy' })
  updatedBy?: User;
}
