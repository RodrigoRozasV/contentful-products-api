import { DeleteProductUseCase } from '../src/application/use-cases/deleted-product.use-case';
import { GetProductByIdUseCase } from '../src/application/use-cases/get-product-by-id.use-case';
import { IProductRepository } from '../src/domain/repositories/product.repository.interface';
import { Product } from '../src/domain/entities/Product';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
  let productRepository: jest.Mocked<IProductRepository>;
  let getProductByIdUseCase: jest.Mocked<GetProductByIdUseCase>;

  beforeEach(() => {
    productRepository = {
      softDelete: jest.fn(),
    } as any;

    getProductByIdUseCase = {
      execute: jest.fn(),
    } as any;

    useCase = new DeleteProductUseCase(productRepository, getProductByIdUseCase);
  });

  describe('execute', () => {
    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should delete a product successfully', async () => {
      const productId = 'test-id-123';
      const mockProduct = new Product(
        productId,
        'Test Product',
        'Electronics',
        99.99,
        'Test description',
        {},
        new Date(),
        new Date(),
        null,
        new Date(),
        new Date(),
      );

      getProductByIdUseCase.execute.mockResolvedValue(mockProduct);
      productRepository.softDelete.mockResolvedValue(undefined);

      const result = await useCase.execute(productId);

      expect(result).toEqual({
        message: 'Product deleted successfully',
        id: productId,
      });
      expect(getProductByIdUseCase.execute).toHaveBeenCalledWith(productId);
      expect(productRepository.softDelete).toHaveBeenCalledWith(productId);
    });

    it('should throw error if product does not exist', async () => {
      const productId = 'non-existent-id';
      getProductByIdUseCase.execute.mockRejectedValue(new Error('Product not found'));

      await expect(useCase.execute(productId)).rejects.toThrow('Product not found');
      expect(productRepository.softDelete).not.toHaveBeenCalled();
    });
  });
});
