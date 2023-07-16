import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('first_name', 20).notNullable();
    table.string('last_name', 50).notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  });

  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary();
    table.string('name', 80).notNullable();
    table.string('description').notNullable();
    table.timestamp('date').notNullable();
    table.string('in_diet').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

    table.uuid('user_id').references('id').inTable('users').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
  await knex.schema.dropTable('meals');
}
