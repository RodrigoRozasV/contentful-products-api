import { Injectable } from '@nestjs/common';
import { IProductRepository } from '@/domain/repositories/product.repository.interface';
import { Pagination } from '@/utils/pagination';
import { PriceRange } from '@/utils/price-range';
import { PaginatedResultDto } from '../dto/paginated-result.dto';
import { ProductFiltersDto } from '../dto/product-filters.dto';

@Injectable()
export class GetProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(
    page: number,
    limit: number,
    filters: ProductFiltersDto,
  ): Promise<PaginatedResultDto> {
    const pagination = new Pagination(page, limit);
    const priceRange = new PriceRange(filters.minPrice, filters.maxPrice);
    const result = await this.productRepository.findAll(pagination, {
      name: filters.name,
      category: filters.category,
      priceRange,
    });
    return new PaginatedResultDto(result.items, {
      total: result.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.calculateTotalPages(result.total),
    });
  }
}
