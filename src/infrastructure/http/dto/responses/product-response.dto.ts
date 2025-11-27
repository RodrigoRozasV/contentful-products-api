import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: '1A2B3C4D5E' })
  id: string;

  @ApiProperty({ example: 'Wireless Mouse' })
  name: string;

  @ApiPropertyOptional({ example: 'Electronics' })
  category: string | null;

  @ApiPropertyOptional({ example: 29.99 })
  price: number | null;

  @ApiPropertyOptional({ example: 'Ergonomic wireless mouse with 6 buttons' })
  description: string | null;

  @ApiPropertyOptional({
    example: { sku: 'WM-001', brand: 'TechCorp' },
  })
  metadata: Record<string, any> | null;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-20T14:45:00.000Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ example: null })
  deletedAt: Date | null;

  @ApiPropertyOptional({ example: '2024-01-15T10:30:00.000Z' })
  contentfulCreatedAt: Date | null;

  @ApiPropertyOptional({ example: '2024-01-20T14:45:00.000Z' })
  contentfulUpdatedAt: Date | null;
}