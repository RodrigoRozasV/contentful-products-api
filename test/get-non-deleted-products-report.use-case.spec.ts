import { GetNonDeletedProductsReportUseCase } from '../src/application/use-cases/get-non-deleted-products-report.use-case';
import { IProductRepository } from '../src/domain/repositories/product.repository.interface';
import { ProductStatisticsService } from '../src/domain/services/product-statistics.service';

describe('GetNonDeletedProductsReportUseCase', () => {
  let useCase: GetNonDeletedProductsReportUseCase;
  let productRepository: jest.Mocked<IProductRepository>;
  let statisticsService: ProductStatisticsService;

  beforeEach(() => {
    productRepository = {
      countByDateRange: jest.fn(),
      countWithPriceByDateRange: jest.fn(),
      countWithoutPriceByDateRange: jest.fn(),
    } as any;

    statisticsService = new ProductStatisticsService();
    useCase = new GetNonDeletedProductsReportUseCase(productRepository, statisticsService);
  });

  describe('execute', () => {
    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should return report without filters', async () => {
      productRepository.countByDateRange.mockResolvedValue(100);
      productRepository.countWithPriceByDateRange.mockResolvedValue(80);
      productRepository.countWithoutPriceByDateRange.mockResolvedValue(20);

      const result = await useCase.execute({});

      expect(result.totalNonDeletedProducts).toBe(100);
      expect(result.productsWithPrice).toBe(80);
      expect(result.productsWithoutPrice).toBe(20);
      expect(result.percentageWithPrice).toBe(80);
      expect(result.percentageWithoutPrice).toBe(20);
    });

    it('should filter by hasPrice=true', async () => {
      productRepository.countByDateRange.mockResolvedValue(100);
      productRepository.countWithPriceByDateRange.mockResolvedValue(80);

      const result = await useCase.execute({ hasPrice: true });

      expect(result.productsWithPrice).toBe(80);
      expect(result.productsWithoutPrice).toBe(0);
      expect(productRepository.countWithoutPriceByDateRange).not.toHaveBeenCalled();
    });

    it('should filter by hasPrice=false', async () => {
      productRepository.countByDateRange.mockResolvedValue(100);
      productRepository.countWithoutPriceByDateRange.mockResolvedValue(20);

      const result = await useCase.execute({ hasPrice: false });

      expect(result.productsWithPrice).toBe(0);
      expect(result.productsWithoutPrice).toBe(20);
      expect(productRepository.countWithPriceByDateRange).not.toHaveBeenCalled();
    });

    it('should filter by date range', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-12-31';

      productRepository.countByDateRange.mockResolvedValue(50);
      productRepository.countWithPriceByDateRange.mockResolvedValue(40);
      productRepository.countWithoutPriceByDateRange.mockResolvedValue(10);

      const result = await useCase.execute({ startDate, endDate });

      expect(result.filters.startDate).toBe(startDate);
      expect(result.filters.endDate).toBe(endDate);
    });
  });
});
