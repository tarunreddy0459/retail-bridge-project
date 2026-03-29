import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepo.create(createCategoryDto);
    return await this.categoryRepo.save(category);
  }

  async findAll(query: QueryCategoryDto) {
    const { page = 1, limit = 10, search, isDisabled } = query;
    const skip = (page - 1) * limit;

    const whereParams: any = {};

    if (isDisabled !== undefined) {
      whereParams.isDisabled = isDisabled;
    } else {
      whereParams.isDisabled = false; // By default only return active categories
    }

    if (search) {
      whereParams.name = Like(`%${search}%`);
    }

    const [data, total] = await this.categoryRepo.findAndCount({
      where: whereParams,
      skip,
      take: limit,
      // order: { name: 'ASC' }, // Example default ordering
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    this.categoryRepo.merge(category, updateCategoryDto);
    return await this.categoryRepo.save(category);
  }
}
