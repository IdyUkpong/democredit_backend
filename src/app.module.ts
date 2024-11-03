import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from './knex/knex.module'; 
import { UserModule } from './user/user.module';

@Module({
  imports: [KnexModule, UserModule], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
