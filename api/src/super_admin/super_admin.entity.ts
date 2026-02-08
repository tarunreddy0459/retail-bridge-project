import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('super_admins')
export class SuperAdmin {
  @PrimaryGeneratedColumn('uuid')
  id: string; // UUID – used as reference in other tables

  @Column({ type: String, length: 150 })
  name: string;

  @Column({ type: String, length: 255 })
  email: string;

  @Column({ type: String, length: 255, select: false })
  password: string;

  @Column({ type: String })
  phoneNumber: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
