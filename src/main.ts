import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KnexService } from './knex/knex.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const knexService = app.get(KnexService);

  await knexService.testConnection(); 
 
  
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
