import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GetProductsUseCase } from '@/application/use-cases/get-products.use-case';
import { GetProductByIdUseCase } from '@/application/use-cases/get-product-by-id.use-case';
import { DeleteProductUseCase } from '@/application/use-cases/deleted-product.use-case';
import { SyncProductsFromContentfulUseCase } from '@/application/use-cases/sync-products-from-contentful.use-case';
import { QueryProductsHttpDto } from '../dto/requests/query-products.dto';
import { ProductFiltersDto } from '@/application/dto/product-filters.dto';
import { PaginatedProductsResponseDto } from '../dto/responses/paginated-products-response.dto';
import { ProductResponseDto } from '../dto/responses/product-response.dto';

@ApiTags('Products (Public)')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly syncProductsUseCase: SyncProductsFromContentfulUseCase,
  ) {}

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Manually trigger sync from Contentful',
    description: 'Synchronizes products from Contentful API to the database',
  })
  @ApiResponse({
    status: 200,
    description: 'Sync completed successfully',
    schema: {
      example: { message: 'Sync completed successfully' },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error syncing from Contentful',
  })
  async syncProducts() {
    await this.syncProductsUseCase.execute();
    return { message: 'Sync completed successfully' };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products with pagination and filters',
    description: 'Returns a paginated list of products with optional filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated products',
    type: PaginatedProductsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid parameters',
  })
  async findAll(@Query() query: QueryProductsHttpDto) {
    const filters = new ProductFiltersDto(
      query.name,
      query.category,
      query.minPrice,
      query.maxPrice,
    );

    return this.getProductsUseCase.execute(
      query.page || 1,
      query.limit || 5,
      filters,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single product by ID',
    description: 'Returns product details for the specified ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '1A2B3C4D5E',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the product',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async findOne(@Param('id') id: string) {
    return this.getProductByIdUseCase.execute(id);
  }

  @Delete(':id')
 @ApiOperation({
    summary: 'Soft delete a product',
    description: 'Marks a product as deleted without removing it from the database',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID to delete',
    example: '1A2B3C4D5E',
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    schema: {
      example: {
        message: 'Product deleted successfully',
        id: '1A2B3C4D5E',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async remove(@Param('id') id: string) {
    return this.deleteProductUseCase.execute(id);
  }
}