import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from './knex/knex.module'; 
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import knexConfig from 'knexfile';
import knex from 'knex';

@Module({
  imports: [KnexModule, UserModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    })
  ], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    const environment = process.env.NODE_ENV || 'development'; // Use NODE_ENV or default to 'development'
    const knexInstance = knex(knexConfig[environment]); // Use the correct config for the current environment
    
    await knexInstance.migrate.latest(); // Run migrations
    console.log('Migrations are up to date');
  }
  }
