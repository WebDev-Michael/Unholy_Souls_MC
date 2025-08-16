import knex from 'knex';
import config from '../knexfile.js';

// Get the environment from NODE_ENV or default to development
const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];

// Create the database connection
const db = knex(dbConfig);

// Test the connection
db.raw('SELECT 1')
  .then(() => {
    console.log(`Database connected successfully in ${environment} mode`);
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

export default db;
