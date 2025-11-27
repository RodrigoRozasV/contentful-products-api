import { Injectable } from '@nestjs/common';
import { IProductRepository } from '@/domain/repositories/product.repository.interface';
import { GetProductByIdUseCase } from './get-product-by-id.use-case';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
  ) {}

  async execute(id: string): Promise<{ message: string; id: string }> {
    await this.getProductByIdUseCase.execute(id);
    await this.productRepository.softDelete(id);
    return {
      message: 'Product deleted successfully',
      id,
    };
  }
}