import { ApiProperty } from '@nestjs/swagger';

export class DeletedProductsReportResponseDto {
  @ApiProperty({
    example: 150,
    description: 'Total number of products (including deleted)',
  })
  totalProducts: number;

  @ApiProperty({
    example: 15,
    description: 'Number of deleted products',
  })
  deletedProducts: number;

  @ApiProperty({
    example: 10.0,
    description: 'Percentage of deleted products',
  })
  percentageDeleted: number;
}