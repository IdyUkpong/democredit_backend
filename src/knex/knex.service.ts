import { Injectable } from '@nestjs/common';
import knex, { Knex } from 'knex';
import knexConfig from 'knexfile'; 

@Injectable()
export class KnexService {
    private knex: Knex;

  constructor() {
    const environment = process.env.NODE_ENV || 'development'; 
    this.knex = knex(knexConfig[environment]); 
}

  getKnex(): Knex {
    return this.knex;
  }


  async testConnection(): Promise<void> {
    try {
      await this.knex.raw('SELECT 1'); 
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error; 
    }
  }
  
  
  async destroy(): Promise<void> {
    await this.knex.destroy();
  }
}
