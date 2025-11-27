import { Provider } from '@nestjs/common';
import { ProductRepository } from '../infrastructure/persistence/repositories/product.repository';
import { ContentfulClientAdapter } from '../infrastructure/external-services/contentful/contentful-client.adapter';

export const repositoryProviders: Provider[] = [
  {
    provide: 'IProductRepository',
    useClass: ProductRepository,
  },
];

export const externalServiceProviders: Provider[] = [
  {
    provide: 'IContentfulClient',
    useClass: ContentfulClientAdapter,
  },
];
