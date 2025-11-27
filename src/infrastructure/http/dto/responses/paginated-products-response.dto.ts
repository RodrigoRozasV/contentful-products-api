import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from './product-response.dto';

class PaginationMetadata {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 5 })
  limit: number;

  @ApiProperty({ example: 20 })
  totalPages: number;
}

export class PaginatedProductsResponseDto {
  @ApiProperty({
    type: [ProductResponseDto],
    description: 'Array of products',
  })
  items: ProductResponseDto[];

  @ApiProperty({
    type: PaginationMetadata,
    description: 'Pagination metadata',
  })
  metadata: PaginationMetadata;
}
