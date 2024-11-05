import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KnexService } from './knex/knex.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const knexService = app.get(KnexService);
  app.enableCors();
  await knexService.testConnection(); 
 
  
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
