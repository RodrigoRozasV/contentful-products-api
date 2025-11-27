import { Module } from '@nestjs/common';
import { ContentfulClientAdapter } from './contentful/contentful-client.adapter';

@Module({
  providers: [
    {
      provide: 'IContentfulClient',
      useClass: ContentfulClientAdapter,
    },
  ],
  exports: ['IContentfulClient'],
})
export class ExternalServicesModule {}