import { Module } from '@nestjs/common';
import { ApplicationModule } from '../../application/application.module';
import { SyncProductsScheduler } from './sync-products.scheduler';

@Module({
  imports: [ApplicationModule],
  providers: [SyncProductsScheduler],
})
export class ScheduledTasksModule {}
