import { Injectable } from '@nestjs/common';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { ProductStatisticsService } from '../../domain/services/product-statistics.service';
import { DateRange } from '@/utils/date-range';

export interface NonDeletedReportFilters {
  startDate?: string;
  endDate?: string;
  hasPrice?: boolean;
}

@Injectable()
export class GetNonDeletedProductsReportUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly statisticsService: ProductStatisticsService,
  ) {}

  async execute(filters: NonDeletedReportFilters) {
    const dateRange = new DateRange(
      filters.startDate ? new Date(filters.startDate) : undefined,
      filters.endDate ? new Date(filters.endDate) : undefined,
    );
    const totalNonDeleted = await this.productRepository.countByDateRange(dateRange);

    let productsWithPrice: number;
    let productsWithoutPrice: number;

    if (filters.hasPrice === true) {
      productsWithPrice = await this.productRepository.countWithPriceByDateRange(dateRange);
      productsWithoutPrice = 0;
    } else if (filters.hasPrice === false) {
      productsWithPrice = 0;
      productsWithoutPrice = await this.productRepository.countWithoutPriceByDateRange(dateRange);
    } else {
      productsWithPrice = await this.productRepository.countWithPriceByDateRange(dateRange);
      productsWithoutPrice = await this.productRepository.countWithoutPriceByDateRange(dateRange);
    }

    const percentageWithPrice = this.statisticsService.calculatePercentage(
      productsWithPrice,
      totalNonDeleted,
    );
    const percentageWithoutPrice = this.statisticsService.calculatePercentage(
      productsWithoutPrice,
      totalNonDeleted,
    );

    return {
      totalNonDeletedProducts: totalNonDeleted,
      productsWithPrice,
      productsWithoutPrice,
      percentageWithPrice,
      percentageWithoutPrice,
      filters: {
        startDate: filters.startDate || 'not specified',
        endDate: filters.endDate || 'not specified',
        hasPrice: filters.hasPrice !== undefined ? filters.hasPrice : 'all',
      },
    };
  }
}