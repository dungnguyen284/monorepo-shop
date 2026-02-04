import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product, Category, User } from '../../entities';
import { ConfigService } from '../../common/config/config.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, User])],
  controllers: [ProductController],
  providers: [ProductService, ConfigService],
  exports: [ProductService],
})
export class ProductModule {}
