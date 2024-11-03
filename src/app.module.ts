import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from './knex/knex.module'; 
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

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
export class AppModule  {}
