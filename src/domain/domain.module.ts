import { Module } from '@nestjs/common';
import { ProductStatisticsService } from './services/product-statistics.service';

@Module({
  providers: [
    {
      provide: 'ProductStatisticsService',
      useClass: ProductStatisticsService,
    },
  ],
  exports: ['ProductStatisticsService'],
})
export class DomainModule {}