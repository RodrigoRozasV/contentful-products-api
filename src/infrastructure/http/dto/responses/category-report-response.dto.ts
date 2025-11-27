import { ApiProperty } from '@nestjs/swagger';

class CategoryBreakdown {
  @ApiProperty({ example: 'Electronics' })
  category: string;

  @ApiProperty({ example: 50 })
  count: number;

  @ApiProperty({ example: 299.99 })
  averagePrice: number | null;

  @ApiProperty({ example: 19.99 })
  minPrice: number | null;

  @ApiProperty({ example: 999.99 })
  maxPrice: number | null;
}

export class CategoryReportResponseDto {
  @ApiProperty({
    example: 150,
    description: 'Total number of products',
  })
  totalProducts: number;

  @ApiProperty({
    example: 140,
    description: 'Number of products with category assigned',
  })
  productsWithCategory: number;

  @ApiProperty({
    example: 10,
    description: 'Number of products without category',
  })
  productsWithoutCategory: number;

  @ApiProperty({
    type: [CategoryBreakdown],
    description: 'Breakdown by category with price statistics',
  })
  categoriesBreakdown: CategoryBreakdown[];
}
