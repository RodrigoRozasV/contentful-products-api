import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class ReportFiltersDto {
  @ApiPropertyOptional({ description: 'Start date for filtering (ISO 8601 format)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for filtering (ISO 8601 format)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Filter products with price' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasPrice?: boolean;
}

