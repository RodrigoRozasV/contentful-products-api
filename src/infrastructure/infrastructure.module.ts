import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence/persistence.module';
import { ExternalServicesModule } from './external-services/external-services.module';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from './http/http.module';
import { ScheduledTasksModule } from './scheduled-tasks/scheduled-tasks.module';

@Module({
  imports: [
    PersistenceModule,
    ExternalServicesModule,
    AuthModule,
    HttpModule,
    ScheduledTasksModule,
  ],
  exports: [PersistenceModule, ExternalServicesModule],
})
export class InfrastructureModule {}