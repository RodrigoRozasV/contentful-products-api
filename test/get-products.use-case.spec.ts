import { Test, TestingModule } from '@nestjs/testing';
import { GetProductsUseCase } from '../src/application/use-cases/get-products.use-case';
import { IProductRepository } from '../src/domain/repositories/product.repository.interface';
import { Product } from '../src/domain/entities/Product';
import { ProductFiltersDto } from '../src/application/dto/product-filters.dto';

describe('GetProductsUseCase', () => {
  let useCase: GetProductsUseCase;
  let repository: jest.Mocked<IProductRepository>;

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      softDelete: jest.fn(),
      countTotal: jest.fn(),
      countDeleted: jest.fn(),
      countWithPrice: jest.fn(),
      countWithoutPrice: jest.fn(),
      countByDateRange: jest.fn(),
      countWithPriceByDateRange: jest.fn(),
      countWithoutPriceByDateRange: jest.fn(),
      findProductsByCategory: jest.fn(),
      saveMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'IProductRepository',
          useValue: mockRepository,
        },
        {
          provide: GetProductsUseCase,
          useFactory: (repo) => new GetProductsUseCase(repo),
          inject: ['IProductRepository'],
        },
      ],
    }).compile();

    useCase = module.get<GetProductsUseCase>(GetProductsUseCase);
    repository = module.get('IProductRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return paginated products', async () => {
    const mockProducts = [
      new Product(
        '1',
        'Product 1',
        'Electronics',
        99.99,
        'Desc',
        {},
        new Date(),
        new Date(),
        null,
        new Date(),
        new Date(),
      ),
    ];

    repository.findAll.mockResolvedValue({
      items: mockProducts,
      total: 1,
    });

    const filters = new ProductFiltersDto();
    const result = await useCase.execute(1, 5, filters);

    expect(result.items).toHaveLength(1);
    expect(result.metadata.total).toBe(1);
    expect(result.metadata.page).toBe(1);
    expect(result.metadata.limit).toBe(5);
    expect(repository.findAll).toHaveBeenCalled();
  });
});