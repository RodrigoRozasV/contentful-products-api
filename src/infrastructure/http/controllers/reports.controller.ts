import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/infrastructure/auth/guards/jwt-auth.guard';
import { GetDeletedProductsReportUseCase } from '@/application/use-cases/get-deleted-products-report.use-case';
import { GetNonDeletedProductsReportUseCase } from '@/application/use-cases/get-non-deleted-products-report.use-case';
import { GetProductsByCategoryReportUseCase } from '@/application/use-cases/get-products-by-category-report.use-case';
import { ReportFiltersHttpDto } from '../../../application/dto/report-filters.dto';
import { DeletedProductsReportResponseDto } from '../dto/responses/deleted-products-report-response.dto';
import { NonDeletedProductsReportResponseDto } from '../dto/responses/non-deleted-products-report-response.dto';
import { CategoryReportResponseDto } from '../dto/responses/category-report-response.dto';

@ApiTags('Reports (Private)')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(
    private readonly getDeletedReportUseCase: GetDeletedProductsReportUseCase,
    private readonly getNonDeletedReportUseCase: GetNonDeletedProductsReportUseCase,
    private readonly getCategoryReportUseCase: GetProductsByCategoryReportUseCase,
  ) {}

  @Get('deleted-products')
  @ApiOperation({
    summary: 'Get percentage of deleted products',
    description: 'Returns statistics about deleted products',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns deleted products statistics',
    type: DeletedProductsReportResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  async getDeletedProductsReport() {
    return this.getDeletedReportUseCase.execute();
  }

  @Get('non-deleted-products')
  @ApiOperation({
    summary: 'Get statistics of non-deleted products with filters',
    description: 'Returns statistics about non-deleted products with optional date and price filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns non-deleted products statistics',
    type: NonDeletedProductsReportResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  async getNonDeletedProductsReport(@Query() filters: ReportFiltersHttpDto) {
    return this.getNonDeletedReportUseCase.execute(filters);
  }

  @Get('products-by-category')
  @ApiOperation({
    summary: 'Get products breakdown by category with price statistics',
    description: 'Returns products grouped by category with aggregated price statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns products grouped by category',
    type: CategoryReportResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  async getProductsByCategoryReport() {
    return this.getCategoryReportUseCase.execute();
  }
}