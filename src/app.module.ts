import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from './knex/knex.module'; 
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import knexConfig from 'knexfile';
import knex from 'knex';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [KnexModule, UserModule,AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    })
  ], 
  controllers: [AppController, AuthController],
  providers: [AppService,AuthService,JwtService, UserService],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    const environment = process.env.NODE_ENV || 'development'; 
    const knexInstance = knex(knexConfig[environment]); 
    
    await knexInstance.migrate.latest(); 
    console.log('Migrations are up to date');
  }
  }
