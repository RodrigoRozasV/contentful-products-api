import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SyncProductsFromContentfulUseCase } from '../../application/use-cases/sync-products-from-contentful.use-case';

@Injectable()
export class SyncProductsScheduler {
  private readonly logger = new Logger(SyncProductsScheduler.name);

  constructor(private readonly syncProductsUseCase: SyncProductsFromContentfulUseCase) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleSyncProducts() {
    this.logger.log('Executing scheduled product sync...');
    await this.syncProductsUseCase.execute();
  }
}
