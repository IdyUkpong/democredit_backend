import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from './knex/knex.module'; 
import { UserModule } from './user/user.module';
import cors from 'cors'

@Module({
  imports: [KnexModule, UserModule], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule  {}
