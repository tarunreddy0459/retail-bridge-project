import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.productRepository.findOne({
      where: { sku: createProductDto.sku },
    });
    if (existingProduct) {
      throw new ConflictException('Product with this SKU already exists');
    }

    const newProduct = this.productRepository.create(createProductDto);
    return await this.productRepository.save(newProduct);
  }

  async findAll(queryDto: QueryProductDto) {
    const { page = 1, limit = 10, search, categoryID, brandID, is_age_restricted } = queryDto;
    const skip = (page - 1) * limit;

    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand');

    if (search) {
      query.andWhere(
        '(product.name LIKE :search OR product.sku LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (categoryID) {
      query.andWhere('product.categoryID = :categoryID', { categoryID });
    }

    if (brandID) {
      query.andWhere('product.brandID = :brandID', { brandID });
    }

    if (is_age_restricted !== undefined) {
      query.andWhere('product.is_age_restricted = :is_age_restricted', {
        is_age_restricted,
      });
    }

    const [data, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('product.createdAt', 'DESC')
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      metadata: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'brand'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingSku = await this.productRepository.findOne({
        where: { sku: updateProductDto.sku },
      });
      if (existingSku) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    return await this.productRepository.remove(product);
  }
}
