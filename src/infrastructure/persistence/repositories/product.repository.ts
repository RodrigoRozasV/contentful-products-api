import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { IProductRepository } from '@/domain/repositories/product.repository.interface';
import { Product } from '@/domain/entities/Product';
import { Pagination } from '@/utils/pagination';
import { PriceRange } from '@/utils/price-range';
import { DateRange } from '@/utils/date-range';
import { ProductEntity } from '../typeorm/entities/product.entity';
import { ProductMapper } from '../typeorm/mappers/product.mapper';

type ProductsByCategoryResult = {
  category: string;
  count: number;
  averagePrice: number | null;
  minPrice: number | null;
  maxPrice: number | null;
};

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly ormRepository: Repository<ProductEntity>,
  ) {}

  async save(product: Product): Promise<Product> {
    const entity = ProductMapper.toEntity(product);
    const saved = await this.ormRepository.save(entity);
    return ProductMapper.toDomain(saved);
  }

  async saveMany(products: Product[]): Promise<void> {
    const entities = products.map((p) => ProductMapper.toEntity(p));
    await this.ormRepository.save(entities);
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async findAll(
    pagination: Pagination,
    filters?: {
      name?: string;
      category?: string;
      priceRange?: PriceRange;
    },
  ): Promise<{ items: Product[]; total: number }> {
    const queryBuilder = this.ormRepository.createQueryBuilder('product');

    if (filters?.name) {
      queryBuilder.andWhere('product.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    if (filters?.category) {
      queryBuilder.andWhere('product.category ILIKE :category', {
        category: `%${filters.category}%`,
      });
    }

    if (filters?.priceRange?.min !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice: filters.priceRange.min,
      });
    }

    if (filters?.priceRange?.max !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice: filters.priceRange.max,
      });
    }

    queryBuilder.skip(pagination.skip).take(pagination.limit);

    const [entities, total] = await queryBuilder.getManyAndCount();

    return {
      items: ProductMapper.toDomainArray(entities),
      total,
    };
  }

  async softDelete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  async countTotal(includeDeleted: boolean = false): Promise<number> {
    return this.ormRepository.count({ withDeleted: includeDeleted });
  }

  async countDeleted(): Promise<number> {
    return this.ormRepository.count({
      where: { deletedAt: Not(IsNull()) },
      withDeleted: true,
    });
  }

  async countWithPrice(): Promise<number> {
    return this.ormRepository.count({
      where: { price: Not(IsNull()) },
    });
  }

  async countWithoutPrice(): Promise<number> {
    return this.ormRepository.count({
      where: { price: IsNull() },
    });
  }

  async countByDateRange(dateRange: DateRange): Promise<number> {
    const queryBuilder = this.ormRepository.createQueryBuilder('product');

    if (dateRange.startDate) {
      queryBuilder.andWhere('product.createdAt >= :startDate', {
        startDate: dateRange.startDate,
      });
    }

    if (dateRange.endDate) {
      queryBuilder.andWhere('product.createdAt <= :endDate', {
        endDate: dateRange.endDate,
      });
    }

    return queryBuilder.getCount();
  }

  async countWithPriceByDateRange(dateRange: DateRange): Promise<number> {
    const queryBuilder = this.ormRepository.createQueryBuilder('product');

    queryBuilder.andWhere('product.price IS NOT NULL');

    if (dateRange.startDate) {
      queryBuilder.andWhere('product.createdAt >= :startDate', {
        startDate: dateRange.startDate,
      });
    }

    if (dateRange.endDate) {
      queryBuilder.andWhere('product.createdAt <= :endDate', {
        endDate: dateRange.endDate,
      });
    }

    return queryBuilder.getCount();
  }

  async countWithoutPriceByDateRange(dateRange: DateRange): Promise<number> {
    const queryBuilder = this.ormRepository.createQueryBuilder('product');

    queryBuilder.andWhere('product.price IS NULL');

    if (dateRange.startDate) {
      queryBuilder.andWhere('product.createdAt >= :startDate', {
        startDate: dateRange.startDate,
      });
    }

    if (dateRange.endDate) {
      queryBuilder.andWhere('product.createdAt <= :endDate', {
        endDate: dateRange.endDate,
      });
    }

    return queryBuilder.getCount();
  }

  async findProductsByCategory(): Promise<ProductsByCategoryResult[]> {
  const results = await this.ormRepository
    .createQueryBuilder('product')
    .select('product.category', 'category')
    .addSelect('COUNT(*)', 'count')
    .addSelect('AVG(product.price)', 'averagePrice')
    .addSelect('MIN(product.price)', 'minPrice')
    .addSelect('MAX(product.price)', 'maxPrice')
    .where('product.category IS NOT NULL')
    .groupBy('product.category')
    .getRawMany();

  return results.map((r) => ({
    category: r.category,
    count: parseInt(r.count, 10),
    averagePrice: r.averagePrice !== null ? parseFloat(r.averagePrice) : null,
    minPrice: r.minPrice !== null ? parseFloat(r.minPrice) : null,
    maxPrice: r.maxPrice !== null ? parseFloat(r.maxPrice) : null,
  }));
  }
}