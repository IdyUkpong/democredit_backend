import { Knex } from 'knex';
// Create the 'users' table
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.integer('accountNumber').notNullable();
    table.decimal('amount', 14, 2).defaultTo(0);
    table.string('bvn').notNullable();
    table.timestamps(true, true);
  });
}

// Drop the 'users' table
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
