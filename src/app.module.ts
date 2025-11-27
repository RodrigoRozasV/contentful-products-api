import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { DomainModule } from './domain/domain.module';
import { ApplicationModule } from './application/application.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

import { ProductEntity } from './infrastructure/persistence/typeorm/entities/product.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [ProductEntity],
        synchronize: true, // Set to false in production
        logging: false,
      }),
      inject: [ConfigService],
    }),
    
    ScheduleModule.forRoot(),
    DomainModule,
    ApplicationModule,
    InfrastructureModule,
  ],
})
export class AppModule {}