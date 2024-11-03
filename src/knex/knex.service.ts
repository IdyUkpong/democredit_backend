import { Injectable } from '@nestjs/common';
import knex, { Knex } from 'knex';
import knexConfig from 'knexfile'; 

@Injectable()
export class KnexService {
    private knex: Knex;

  constructor() {
    const environment = process.env.NODE_ENV || 'development'; // Default to development
    this.knex = knex(knexConfig[environment]); // This is correct
}

  getKnex(): Knex {
    return this.knex;
  }


  async testConnection(): Promise<void> {
    try {
      await this.knex.raw('SELECT 1'); // Simple query to test connection
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error; // Rethrow or handle the error as needed
    }
  }
  
  // Optional: add methods for query execution
//   async query<T>(query: string): Promise<T[]> {
//     return await this.knex.raw(query);
//   }

  // Don't forget to clean up the connection if necessary
  async destroy(): Promise<void> {
    await this.knex.destroy();
  }
}
