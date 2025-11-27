import { Product } from '@/domain/entities/Product';
import { ProductEntity } from '../entities/product.entity';

export class ProductMapper {
  static toDomain(entity: ProductEntity): Product {
    return new Product(
      entity.id,
      entity.name,
      entity.category,
      entity.price ? parseFloat(entity.price.toString()) : null,
      entity.description,
      entity.metadata,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
      entity.contentfulCreatedAt,
      entity.contentfulUpdatedAt,
    );
  }

  static toEntity(domain: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.category = domain.category;
    entity.price = domain.price;
    entity.description = domain.description;
    entity.metadata = domain.metadata;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;
    entity.contentfulCreatedAt = domain.contentfulCreatedAt;
    entity.contentfulUpdatedAt = domain.contentfulUpdatedAt;
    return entity;
  }

  static toDomainArray(entities: ProductEntity[]): Product[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}