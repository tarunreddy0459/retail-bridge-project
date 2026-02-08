import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateSuperAdminResponseDto } from './dto/create_super_admin_response.dto';
import { SuperAdmin } from './super_admin.entity';
import { CreateSuperAdminDto } from './dto/create_super_admin.dto';
import { UpdateSuperAdminDto } from './dto/update_super_admin.dto';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(SuperAdmin)
    private readonly repo: Repository<SuperAdmin>,
  ) {}
  private toResponseDto(admin: SuperAdmin): CreateSuperAdminResponseDto {
    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      // password: admin.password,
      phoneNumber: admin.phoneNumber,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }

  private hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async create(dto: CreateSuperAdminDto): Promise<CreateSuperAdminResponseDto> {
    const admin = this.repo.create({
      name: dto.name,
      email: dto.email,
      password: await this.hashPassword(dto.password),
    });

    const saved = await this.repo.save(admin);
    return this.toResponseDto(saved);
  }

  async findAll(): Promise<CreateSuperAdminResponseDto[]> {
    const admins = await this.repo.find();
    return admins.map((a) => this.toResponseDto(a));
  }

  async findOne(id: string): Promise<CreateSuperAdminResponseDto> {
    const admin = await this.repo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('SuperAdmin not found');

    return this.toResponseDto(admin);
  }

  async update(
    id: string,
    dto: UpdateSuperAdminDto,
  ): Promise<CreateSuperAdminResponseDto> {
    const admin = await this.repo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('SuperAdmin not found');

    if (dto.name) admin.name = dto.name;
    if (dto.email) admin.email = dto.email;
    if (dto.password) {
      admin.password = await this.hashPassword(dto.password);
    }

    const updated = await this.repo.save(admin);
    return this.toResponseDto(updated);
  }

  async remove(id: string) {
    const admin = await this.repo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('SuperAdmin not found');

    await this.repo.remove(admin);
    return { message: 'SuperAdmin deleted', id };
  }
}
