import { Product } from '@/domain/entities/Product';

export class PaginatedResultDto {
  constructor(
    public readonly items: Product[],
    public readonly metadata: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    },
  ) {}
}
