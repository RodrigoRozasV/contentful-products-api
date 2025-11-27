import { SyncProductsFromContentfulUseCase } from '../src/application/use-cases/sync-products-from-contentful.use-case';
import { IProductRepository } from '../src/domain/repositories/product.repository.interface';
import { IContentfulClient } from '../src/domain/repositories/contentful-client.interface';
import { Logger } from '@nestjs/common';

describe('SyncProductsFromContentfulUseCase', () => {
  let useCase: SyncProductsFromContentfulUseCase;
  let productRepository: jest.Mocked<IProductRepository>;
  let contentfulClient: jest.Mocked<IContentfulClient>;

  beforeEach(() => {
    productRepository = {
      saveMany: jest.fn(),
    } as any;

    contentfulClient = {
      fetchProducts: jest.fn(),
    } as any;

    useCase = new SyncProductsFromContentfulUseCase(productRepository, contentfulClient);

    // Mock logger to avoid console output
    jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should sync products from Contentful successfully', async () => {
      const mockContentfulProducts = [
        {
          id: '1',
          name: 'Product 1',
          category: 'Electronics',
          price: 99.99,
          description: 'Test product 1',
          metadata: { sku: 'P001' },
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        },
        {
          id: '2',
          name: 'Product 2',
          category: 'Books',
          price: 19.99,
          description: 'Test product 2',
          metadata: { sku: 'P002' },
          createdAt: new Date('2024-01-03'),
          updatedAt: new Date('2024-01-04'),
        },
      ];

      contentfulClient.fetchProducts.mockResolvedValue(mockContentfulProducts);
      productRepository.saveMany.mockResolvedValue(undefined);

      await useCase.execute();

      expect(contentfulClient.fetchProducts).toHaveBeenCalledTimes(1);
      expect(productRepository.saveMany).toHaveBeenCalledTimes(1);

      const savedProducts = (productRepository.saveMany as jest.Mock).mock.calls[0][0];
      expect(savedProducts).toHaveLength(2);
      expect(savedProducts[0].id).toBe('1');
      expect(savedProducts[0].name).toBe('Product 1');
    });

    it('should handle empty products from Contentful', async () => {
      contentfulClient.fetchProducts.mockResolvedValue([]);
      productRepository.saveMany.mockResolvedValue(undefined);

      await useCase.execute();

      expect(contentfulClient.fetchProducts).toHaveBeenCalledTimes(1);
      expect(productRepository.saveMany).toHaveBeenCalledWith([]);
    });

    it('should throw error if Contentful fetch fails', async () => {
      const error = new Error('Contentful API error');
      contentfulClient.fetchProducts.mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow('Contentful API error');
      expect(productRepository.saveMany).not.toHaveBeenCalled();
    });

    it('should throw error if repository save fails', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Product 1',
          category: 'Test',
          price: 10,
          description: 'Test',
          metadata: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      contentfulClient.fetchProducts.mockResolvedValue(mockProducts);
      productRepository.saveMany.mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute()).rejects.toThrow('Database error');
    });
  });
});
