import { GetDeletedProductsReportUseCase } from '../src/application/use-cases/get-deleted-products-report.use-case';
import { IProductRepository } from '../src/domain/repositories/product.repository.interface';
import { ProductStatisticsService } from '../src/domain/services/product-statistics.service';

describe('GetDeletedProductsReportUseCase', () => {
  let useCase: GetDeletedProductsReportUseCase;
  let productRepository: jest.Mocked<IProductRepository>;
  let statisticsService: ProductStatisticsService;

  beforeEach(() => {
    productRepository = {
      countTotal: jest.fn(),
      countDeleted: jest.fn(),
    } as any;

    statisticsService = new ProductStatisticsService();
    useCase = new GetDeletedProductsReportUseCase(productRepository, statisticsService);
  });

  describe('execute', () => {
    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should return correct report with deleted products', async () => {
      productRepository.countTotal.mockResolvedValue(100);
      productRepository.countDeleted.mockResolvedValue(15);

      const result = await useCase.execute();

      expect(result).toEqual({
        totalProducts: 100,
        deletedProducts: 15,
        percentageDeleted: 15,
      });
      expect(productRepository.countTotal).toHaveBeenCalledWith(true);
      expect(productRepository.countDeleted).toHaveBeenCalledTimes(1);
    });

    it('should handle zero deleted products', async () => {
      productRepository.countTotal.mockResolvedValue(50);
      productRepository.countDeleted.mockResolvedValue(0);

      const result = await useCase.execute();

      expect(result).toEqual({
        totalProducts: 50,
        deletedProducts: 0,
        percentageDeleted: 0,
      });
    });

    it('should handle all products deleted', async () => {
      productRepository.countTotal.mockResolvedValue(20);
      productRepository.countDeleted.mockResolvedValue(20);

      const result = await useCase.execute();

      expect(result).toEqual({
        totalProducts: 20,
        deletedProducts: 20,
        percentageDeleted: 100,
      });
    });

    it('should handle zero total products', async () => {
      productRepository.countTotal.mockResolvedValue(0);
      productRepository.countDeleted.mockResolvedValue(0);

      const result = await useCase.execute();

      expect(result).toEqual({
        totalProducts: 0,
        deletedProducts: 0,
        percentageDeleted: 0,
      });
    });
  });
});
