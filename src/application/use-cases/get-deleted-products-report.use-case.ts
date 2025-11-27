import { Injectable } from '@nestjs/common';
import { IProductRepository } from '@/domain/repositories/product.repository.interface';
import { ProductStatisticsService } from '@/domain/services/product-statistics.service';

@Injectable()
export class GetDeletedProductsReportUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly statisticsService: ProductStatisticsService,
  ) {}

  async execute() {
    const totalProducts = await this.productRepository.countTotal(true);
    const deletedProducts = await this.productRepository.countDeleted();

    const percentageDeleted = this.statisticsService.calculateDeletionRate(
      deletedProducts,
      totalProducts,
    );

    return {
      totalProducts,
      deletedProducts,
      percentageDeleted,
    };
  }
}
