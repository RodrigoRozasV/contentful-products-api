import { Module } from '@nestjs/common';
import { ApplicationModule } from '../../application/application.module';
import { ProductsController } from './controllers/products.controller';
import { ReportsController } from './controllers/reports.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [ProductsController, ReportsController],
})
export class HttpModule {}
