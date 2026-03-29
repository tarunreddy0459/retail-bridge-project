import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { QueryStoreDto } from './dto/query-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = this.storeRepo.create(createStoreDto);
    return await this.storeRepo.save(store);
  }

  async findAll(query: QueryStoreDto) {
    const { page = 1, limit = 10, search, type, userId, isActive } = query;
    const skip = (page - 1) * limit;

    const whereParams: any = {};

    if (isActive !== undefined) {
      whereParams.isActive = isActive;
    } else {
      whereParams.isActive = true; // By default only return active stores
    }

    if (search) {
      whereParams.name = Like(`%${search}%`);
    }

    if (type) {
      whereParams.type = type;
    }

    if (userId) {
      whereParams.userId = userId;
    }

    const [data, total] = await this.storeRepo.findAndCount({
      where: whereParams,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user', 'createdBy', 'updatedBy'],
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepo.findOne({
      where: { id },
      relations: ['user', 'createdBy', 'updatedBy'],
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);
    this.storeRepo.merge(store, updateStoreDto);
    return await this.storeRepo.save(store);
  }

  async remove(id: string): Promise<void> {
    const store = await this.findOne(id);
    store.isActive = false;
    await this.storeRepo.save(store);
  }
}
