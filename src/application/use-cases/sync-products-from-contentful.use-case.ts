import { Injectable, Logger } from '@nestjs/common';
import { IProductRepository } from '@/domain/repositories/product.repository.interface';
import { IContentfulClient } from '@/domain/repositories/contentful-client.interface';
import { Product } from '@/domain/entities/Product';

@Injectable()
export class SyncProductsFromContentfulUseCase {
  private readonly logger = new Logger(SyncProductsFromContentfulUseCase.name);

  constructor(
    private readonly productRepository: IProductRepository,
    private readonly contentfulClient: IContentfulClient,
  ) {}

  async execute(): Promise<void> {
    this.logger.log('Starting sync from Contentful...');

    try {
      const contentfulProducts = await this.contentfulClient.fetchProducts();
      this.logger.log(`Fetched ${contentfulProducts.length} products from Contentful`);
      const domainProducts = contentfulProducts.map(
        (cp) =>
          new Product(
            cp.id,
            cp.name,
            cp.category || null,
            cp.price || null,
            cp.description || null,
            cp.metadata,
            new Date(),
            new Date(),
            null,
            cp.createdAt,
            cp.updatedAt,
          ),
      );
      await this.productRepository.saveMany(domainProducts);
      this.logger.log('Sync completed successfully');
    } catch (error) {
      this.logger.error('Error syncing products from Contentful', error.stack);
      throw error;
    }
  }
}