import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { QueryBrandDto } from './dto/query-brand.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    // Validate that category exists and is NOT disabled
    const category = await this.categoriesService.findOne(
      createBrandDto.categoryId,
    );
    if (category.isDisabled) {
      throw new BadRequestException(
        'Cannot assign brand to a disabled category',
      );
    }

    const brand = this.brandRepo.create(createBrandDto);
    return await this.brandRepo.save(brand);
  }

  async findAll(query: QueryBrandDto) {
    const { page = 1, limit = 10, search, isDisabled, categoryId } = query;
    const skip = (page - 1) * limit;

    const whereParams: any = {};

    if (isDisabled !== undefined) {
      whereParams.isDisabled = isDisabled;
    } else {
      whereParams.isDisabled = false; // By default only return active brands
    }

    if (search) {
      whereParams.name = Like(`%${search}%`);
    }

    if (categoryId) {
      whereParams.categoryId = categoryId;
    }

    const [data, total] = await this.brandRepo.findAndCount({
      where: whereParams,
      skip,
      take: limit,
      relations: ['category'],
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandRepo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(id);

    // If updating category ID, validate that the new category is active
    if (
      updateBrandDto.categoryId &&
      updateBrandDto.categoryId !== brand.categoryId
    ) {
      const category = await this.categoriesService.findOne(
        updateBrandDto.categoryId,
      );
      if (category.isDisabled) {
        throw new BadRequestException(
          'Cannot assign brand to a disabled category',
        );
      }
    }

    this.brandRepo.merge(brand, updateBrandDto);
    return await this.brandRepo.save(brand);
  }
}
