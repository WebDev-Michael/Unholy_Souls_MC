/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('gallery_images', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('category').notNullable();
    table.text('description').notNullable();
    table.string('imageUrl').nullable();
    table.json('tags').notNullable().defaultTo([]); // Store tags as JSON array
    table.boolean('featured').notNullable().defaultTo(false);
    table.string('location').notNullable();
    table.json('members').notNullable().defaultTo([]); // Store members as JSON array
    table.date('date').notNullable();
    table.timestamps(true, true); // Adds created_at and updated_at columns
    
    // Add indexes for better query performance
    table.index('category');
    table.index('featured');
    table.index('date');
    table.index(['category', 'featured']);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('gallery_images');
}
