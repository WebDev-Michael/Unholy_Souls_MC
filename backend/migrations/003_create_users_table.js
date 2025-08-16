/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.enum('role', ['admin', 'member', 'guest']).notNullable().defaultTo('member');
    table.integer('memberId').unsigned().references('id').inTable('members').onDelete('SET NULL');
    table.boolean('isActive').notNullable().defaultTo(true);
    table.timestamp('lastLogin').nullable();
    table.timestamps(true, true); // Adds created_at and updated_at columns
    
    // Add indexes for better query performance
    table.index('username');
    table.index('email');
    table.index('role');
    table.index('memberId');
    table.index('isActive');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('users');
}
