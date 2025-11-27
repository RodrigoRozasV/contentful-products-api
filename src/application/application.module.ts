import { Module } from '@nestjs/common';
import { DomainModule } from '../domain/domain.module';
import { PersistenceModule } from '../infrastructure/persistence/persistence.module';
import { ExternalServicesModule } from '../infrastructure/external-services/external-services.module';

import { GetProductsUseCase } from './use-cases/get-products.use-case';
import { GetProductByIdUseCase } from './use-cases/get-product-by-id.use-case';
import { DeleteProductUseCase } from './use-cases/deleted-product.use-case';
import { SyncProductsFromContentfulUseCase } from './use-cases/sync-products-from-contentful.use-case';

import { GetDeletedProductsReportUseCase } from './use-cases/get-deleted-products-report.use-case';
import { GetNonDeletedProductsReportUseCase } from './use-cases/get-non-deleted-products-report.use-case';
import { GetProductsByCategoryReportUseCase } from './use-cases/get-products-by-category-report.use-case';

@Module({
  imports: [DomainModule, PersistenceModule, ExternalServicesModule],
  providers: [
    {
      provide: GetProductsUseCase,
      useFactory: (productRepository) => {
        return new GetProductsUseCase(productRepository);
      },
      inject: ['IProductRepository'],
    },
    {
      provide: GetProductByIdUseCase,
      useFactory: (productRepository) => {
        return new GetProductByIdUseCase(productRepository);
      },
      inject: ['IProductRepository'],
    },
    {
      provide: DeleteProductUseCase,
      useFactory: (productRepository, getProductByIdUseCase) => {
        return new DeleteProductUseCase(productRepository, getProductByIdUseCase);
      },
      inject: ['IProductRepository', GetProductByIdUseCase],
    },
    {
      provide: SyncProductsFromContentfulUseCase,
      useFactory: (productRepository, contentfulClient) => {
        return new SyncProductsFromContentfulUseCase(productRepository, contentfulClient);
      },
      inject: ['IProductRepository', 'IContentfulClient'],
    },
    {
      provide: GetDeletedProductsReportUseCase,
      useFactory: (productRepository, statisticsService) => {
        return new GetDeletedProductsReportUseCase(productRepository, statisticsService);
      },
      inject: ['IProductRepository', 'ProductStatisticsService'],
    },
    {
      provide: GetNonDeletedProductsReportUseCase,
      useFactory: (productRepository, statisticsService) => {
        return new GetNonDeletedProductsReportUseCase(productRepository, statisticsService);
      },
      inject: ['IProductRepository', 'ProductStatisticsService'],
    },
    {
      provide: GetProductsByCategoryReportUseCase,
      useFactory: (productRepository, statisticsService) => {
        return new GetProductsByCategoryReportUseCase(productRepository, statisticsService);
      },
      inject: ['IProductRepository', 'ProductStatisticsService'],
    },
  ],
  exports: [
    GetProductsUseCase,
    GetProductByIdUseCase,
    DeleteProductUseCase,
    SyncProductsFromContentfulUseCase,
    GetDeletedProductsReportUseCase,
    GetNonDeletedProductsReportUseCase,
    GetProductsByCategoryReportUseCase,
  ],
})
export class ApplicationModule {}
