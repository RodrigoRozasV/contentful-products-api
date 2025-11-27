import { Injectable, NotFoundException } from '@nestjs/common';
import { IProductRepository } from '@/domain/repositories/product.repository.interface';
import { Product } from '@/domain/entities/Product';

@Injectable()
export class GetProductByIdUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }
}
