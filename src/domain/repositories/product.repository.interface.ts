import { Product } from '../entities/Product';
import { Pagination } from '@/utils/pagination';
import { PriceRange } from '@/utils/price-range';
import { DateRange } from '@/utils/date-range';

export interface IProductRepository {
  save(product: Product): Promise<Product>;
  saveMany(products: Product[]): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findAll(
    pagination: Pagination,
    filters?: {
      name?: string;
      category?: string;
      priceRange?: PriceRange;
    },
  ): Promise<{ items: Product[]; total: number }>;
  softDelete(id: string): Promise<void>;
  countTotal(includeDeleted?: boolean): Promise<number>;
  countDeleted(): Promise<number>;
  countWithPrice(): Promise<number>;
  countWithoutPrice(): Promise<number>;
  countByDateRange(dateRange: DateRange): Promise<number>;
  countWithPriceByDateRange(dateRange: DateRange): Promise<number>;
  countWithoutPriceByDateRange(dateRange: DateRange): Promise<number>;
  findProductsByCategory(): Promise<
    Array<{
      category: string;
      count: number;
      averagePrice: number | null;
      minPrice: number | null;
      maxPrice: number | null;
    }>
  >;
}
