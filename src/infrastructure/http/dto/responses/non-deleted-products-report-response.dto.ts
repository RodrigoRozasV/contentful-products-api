import { ApiProperty } from '@nestjs/swagger';

export class NonDeletedProductsReportResponseDto {
  @ApiProperty({
    example: 135,
    description: 'Total number of non-deleted products',
  })
  totalNonDeletedProducts: number;

  @ApiProperty({
    example: 120,
    description: 'Number of products with price',
  })
  productsWithPrice: number;

  @ApiProperty({
    example: 15,
    description: 'Number of products without price',
  })
  productsWithoutPrice: number;

  @ApiProperty({
    example: 88.89,
    description: 'Percentage of products with price',
  })
  percentageWithPrice: number;

  @ApiProperty({
    example: 11.11,
    description: 'Percentage of products without price',
  })
  percentageWithoutPrice: number;

  @ApiProperty({
    example: {
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: '2024-12-31T23:59:59.999Z',
      hasPrice: true,
    },
  })
  filters: {
    startDate: string;
    endDate: string;
    hasPrice: boolean | string;
  };
}