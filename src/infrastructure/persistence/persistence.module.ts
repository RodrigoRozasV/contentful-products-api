import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './typeorm/entities/product.entity';
import { ProductRepository } from './repositories/product.repository';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
  ],
  exports: ['IProductRepository'],
})
export class PersistenceModule {}