import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class ReportFiltersRequestDto {
  @ApiPropertyOptional({
    description: 'Start date for filtering (ISO 8601 format)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering (ISO 8601 format)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Filter products with price (true) or without price (false)',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasPrice?: boolean;
}
