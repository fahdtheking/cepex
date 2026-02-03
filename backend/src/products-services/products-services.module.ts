import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { ProductsServicesController } from './products-services.controller';
import { ProductsServicesService } from './products-services.service';

@Module({
  imports: [AiModule],
  controllers: [ProductsServicesController],
  providers: [ProductsServicesService],
})
export class ProductsServicesModule {}
