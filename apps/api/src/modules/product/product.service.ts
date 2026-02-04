import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Like,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { Product, Category } from '../../entities';
import type {
  CreateProductDto,
  UpdateProductDto,
  ProductDto,
  ProductQueryDto,
  PaginatedResponse,
  ApiSuccessResponse,
} from '@monorepo-shop/shared';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(
    query: ProductQueryDto,
  ): Promise<PaginatedResponse<ProductDto>> {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      minPrice,
      maxPrice,
      isActive,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.name = Like(`%${search}%`);
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.price = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      where.price = LessThanOrEqual(maxPrice);
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [products, total] = await this.productRepository.findAndCount({
      where,
      relations: ['category'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: products.map((p) => this.toDto(p)),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: number): Promise<ApiSuccessResponse<ProductDto>> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      success: true,
      data: this.toDto(product),
    };
  }

  async create(dto: CreateProductDto): Promise<ApiSuccessResponse<ProductDto>> {
    // Kiểm tra category có tồn tại không
    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new BadRequestException(
        `Category with ID ${dto.categoryId} not found`,
      );
    }

    const product = this.productRepository.create(dto);
    const saved = await this.productRepository.save(product);

    const result = await this.productRepository.findOne({
      where: { id: saved.id },
      relations: ['category'],
    });

    return {
      success: true,
      message: 'Product created successfully',
      data: this.toDto(result!),
    };
  }

  async update(
    id: number,
    dto: UpdateProductDto,
  ): Promise<ApiSuccessResponse<ProductDto>> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Nếu update categoryId, kiểm tra category có tồn tại không
    if (dto.categoryId && dto.categoryId !== product.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new BadRequestException(
          `Category with ID ${dto.categoryId} not found`,
        );
      }
    }

    await this.productRepository.update(id, dto);

    const updated = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    return {
      success: true,
      message: 'Product updated successfully',
      data: this.toDto(updated!),
    };
  }

  async remove(id: number): Promise<ApiSuccessResponse<null>> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.remove(product);

    return {
      success: true,
      message: 'Product deleted successfully',
      data: null,
    };
  }

  private toDto(product: Product): ProductDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      image: product.image,
      isActive: product.isActive,
      categoryId: product.categoryId,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
          }
        : undefined,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
