import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'contentful';
import {
  IContentfulClient,
  ContentfulProduct,
} from '../../../domain/repositories/contentful-client.interface';

@Injectable()
export class ContentfulClientAdapter implements IContentfulClient {
  private readonly logger = new Logger(ContentfulClientAdapter.name);
  private readonly client;

  constructor(private configService: ConfigService) {
    this.client = createClient({
      space: this.configService.get<string>('CONTENTFUL_SPACE_ID') || '',
      accessToken: this.configService.get<string>('CONTENTFUL_ACCESS_TOKEN') || '',
      environment: this.configService.get<string>('CONTENTFUL_ENVIRONMENT') || 'master',
    });
  }

  async fetchProducts(): Promise<ContentfulProduct[]> {
    try {
      const response = await this.client.getEntries({
        content_type: this.configService.get<string>('CONTENTFUL_CONTENT_TYPE') || 'product',
      });

      this.logger.log(`Fetched ${response.items.length} products from Contentful`);

      return response.items.map((item) => this.mapToContentfulProduct(item));
    } catch (error) {
      this.logger.error('Error fetching products from Contentful', error);
      throw error;
    }
  }

  private mapToContentfulProduct(entry: any): ContentfulProduct {
    const fields = entry.fields || {};
    const sys = entry.sys || {};

    return {
      id: sys.id || 'unknown',
      name: this.extractName(fields),
      category: this.safeString(fields.category),
      price: this.safeNumber(fields.price),
      description: this.safeString(fields.description),
      metadata: this.buildMetadata(fields, sys),
      createdAt: sys.createdAt ? new Date(sys.createdAt) : new Date(),
      updatedAt: sys.updatedAt ? new Date(sys.updatedAt) : new Date(),
    };
  }

  private extractName(fields: Record<string, any>): string {
    const productName = this.safeString(fields.productName);
    if (productName) return productName;

    const name = this.safeString(fields.name);
    if (name) return name;

    const title = this.safeString(fields.title);
    if (title) return title;

    return 'Unnamed Product';
  }

  private safeString(value: any): string | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (typeof value === 'object') {
      if (Array.isArray(value) && value.length > 0) {
        return this.safeString(value[0]);
      }
      if (value.text) return this.safeString(value.text);
      if (value.value) return this.safeString(value.value);
      if (value.title) return this.safeString(value.title);
      if (value.name) return this.safeString(value.name);
    }

    return undefined;
  }

  private safeNumber(value: any): number | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? undefined : parsed;
    }

    return undefined;
  }

  private buildMetadata(
    fields: Record<string, any>,
    sys: Record<string, any>,
  ): Record<string, any> {
    const metadata: Record<string, any> = {};

    try {
      for (const [key, value] of Object.entries(fields)) {
        if (this.isPrimitive(value)) {
          metadata[key] = value;
        } else if (Array.isArray(value)) {
          metadata[key] = value.map((item) => {
            if (this.isPrimitive(item)) {
              return item;
            } else if (item && typeof item === 'object' && item.sys && item.sys.id) {
              return { id: item.sys.id, type: item.sys.type };
            } else {
              return String(item);
            }
          });
        } else if (value && typeof value === 'object') {
          if (value.sys && value.sys.id) {
            metadata[`${key}Id`] = value.sys.id;
            if (value.sys.type) {
              metadata[`${key}Type`] = value.sys.type;
            }
          } else {
            const simple = this.extractSimpleFields(value);
            if (Object.keys(simple).length > 0) {
              metadata[key] = simple;
            }
          }
        }
      }
      if (sys.id) metadata.contentfulId = sys.id;
      if (sys.revision) metadata.revision = sys.revision;
      if (sys.locale) metadata.locale = sys.locale;
      if (sys.contentType && sys.contentType.sys && sys.contentType.sys.id) {
        metadata.contentType = sys.contentType.sys.id;
      }
    } catch (error) {
      this.logger.warn('Error building metadata', error);
    }

    return metadata;
  }

  private isPrimitive(value: any): boolean {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null
    );
  }

  private extractSimpleFields(obj: any): Record<string, any> {
    const simple: Record<string, any> = {};

    try {
      if (obj && typeof obj === 'object') {
        for (const [key, value] of Object.entries(obj)) {
          if (this.isPrimitive(value)) {
            simple[key] = value;
          }
        }
      }
    } catch (error) {
      this.logger.warn('Error extracting simple fields for metadata', error);
    }

    return simple;
  }
}
