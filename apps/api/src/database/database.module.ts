import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '../common/config/config.service';
import {
  User,
  Role,
  Category,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
} from '../entities';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.dbHost,
        port: configService.dbPort,
        username: configService.dbUser,
        password: configService.dbPassword,
        database: configService.dbName,
        entities: [
          User,
          Role,
          Category,
          Product,
          Cart,
          CartItem,
          Order,
          OrderItem,
        ],
        synchronize: !configService.isProduction,
        logging: configService.isDevelopment,
      }),
      inject: [ConfigService],
      extraProviders: [ConfigService],
    }),
  ],
  providers: [ConfigService],
  exports: [TypeOrmModule, ConfigService],
})
export class DatabaseModule {}
