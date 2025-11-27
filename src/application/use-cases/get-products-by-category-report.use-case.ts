import { Injectable } from '@nestjs/common';
import { IProductRepository } from '@/domain/repositories/product.repository.interface';
import { ProductStatisticsService } from '@/domain/services/product-statistics.service';

@Injectable()
export class GetProductsByCategoryReportUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly statisticsService: ProductStatisticsService,
  ) {}

  async execute() {
    const categoriesData = await this.productRepository.findProductsByCategory();
    
    const totalProducts = await this.productRepository.countTotal();
    const productsWithCategory = categoriesData.reduce((sum, cat) => sum + cat.count, 0);
    const productsWithoutCategory = totalProducts - productsWithCategory;

    // Procesar datos con el servicio de estadísticas
    const categoriesBreakdown = categoriesData.map((cat) => ({
      category: cat.category,
      count: cat.count,
      averagePrice: cat.averagePrice 
        ? this.statisticsService.roundPrice(cat.averagePrice) 
        : null,
      minPrice: cat.minPrice ? this.statisticsService.roundPrice(cat.minPrice) : null,
      maxPrice: cat.maxPrice ? this.statisticsService.roundPrice(cat.maxPrice) : null,
    }));

    return {
      totalProducts,
      productsWithCategory,
      productsWithoutCategory,
      categoriesBreakdown,
    };
  }
}