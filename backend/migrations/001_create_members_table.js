/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('members', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('roadname').nullable();
    table.string('rank').notNullable();
    table.string('chapter').notNullable();
    table.text('bio').notNullable();
    table.string('image').nullable();
    table.timestamps(true, true); // Adds created_at and updated_at columns
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('members');
}
