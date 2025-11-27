import { GetProductsByCategoryReportUseCase } from '../src/application/use-cases/get-products-by-category-report.use-case';
import { IProductRepository } from '../src/domain/repositories/product.repository.interface';
import { ProductStatisticsService } from '../src/domain/services/product-statistics.service';

describe('GetProductsByCategoryReportUseCase', () => {
  let useCase: GetProductsByCategoryReportUseCase;
  let productRepository: jest.Mocked<IProductRepository>;
  let statisticsService: ProductStatisticsService;

  beforeEach(() => {
    productRepository = {
      findProductsByCategory: jest.fn(),
      countTotal: jest.fn(),
    } as any;

    statisticsService = new ProductStatisticsService();
    useCase = new GetProductsByCategoryReportUseCase(productRepository, statisticsService);
  });

  describe('execute', () => {
    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should return category breakdown report', async () => {
      const mockCategoriesData = [
        {
          category: 'Electronics',
          count: 50,
          averagePrice: 299.99,
          minPrice: 19.99,
          maxPrice: 999.99,
        },
        {
          category: 'Books',
          count: 30,
          averagePrice: 24.99,
          minPrice: 9.99,
          maxPrice: 49.99,
        },
      ];

      productRepository.findProductsByCategory.mockResolvedValue(mockCategoriesData);
      productRepository.countTotal.mockResolvedValue(100);

      const result = await useCase.execute();

      expect(result.totalProducts).toBe(100);
      expect(result.productsWithCategory).toBe(80);
      expect(result.productsWithoutCategory).toBe(20);
      expect(result.categoriesBreakdown).toHaveLength(2);
      expect(result.categoriesBreakdown[0].category).toBe('Electronics');
      expect(result.categoriesBreakdown[0].count).toBe(50);
    });

    it('should handle empty categories', async () => {
      productRepository.findProductsByCategory.mockResolvedValue([]);
      productRepository.countTotal.mockResolvedValue(50);

      const result = await useCase.execute();

      expect(result.totalProducts).toBe(50);
      expect(result.productsWithCategory).toBe(0);
      expect(result.productsWithoutCategory).toBe(50);
      expect(result.categoriesBreakdown).toHaveLength(0);
    });

    it('should round prices correctly', async () => {
      const mockData = [
        {
          category: 'Test',
          count: 10,
          averagePrice: 99.999,
          minPrice: 10.123,
          maxPrice: 199.876,
        },
      ];

      productRepository.findProductsByCategory.mockResolvedValue(mockData);
      productRepository.countTotal.mockResolvedValue(10);

      const result = await useCase.execute();

      expect(result.categoriesBreakdown[0].averagePrice).toBe(100);
      expect(result.categoriesBreakdown[0].minPrice).toBe(10.12);
      expect(result.categoriesBreakdown[0].maxPrice).toBe(199.88);
    });

    it('should handle null prices', async () => {
      const mockData = [
        {
          category: 'Free',
          count: 5,
          averagePrice: null,
          minPrice: null,
          maxPrice: null,
        },
      ];

      productRepository.findProductsByCategory.mockResolvedValue(mockData);
      productRepository.countTotal.mockResolvedValue(5);

      const result = await useCase.execute();

      expect(result.categoriesBreakdown[0].averagePrice).toBeNull();
      expect(result.categoriesBreakdown[0].minPrice).toBeNull();
      expect(result.categoriesBreakdown[0].maxPrice).toBeNull();
    });
  });
});
