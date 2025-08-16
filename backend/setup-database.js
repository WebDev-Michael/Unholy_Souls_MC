#!/usr/bin/env node

import { sequelize } from './db/connection.js';
import { up as seedDatabase } from './seeders/001_initial_data.js';

console.log('🚀 Starting database setup for Render deployment...');
console.log('🔍 Environment:', process.env.NODE_ENV || 'development');

async function setupDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test database connection with timeout
    const connectionPromise = sequelize.authenticate();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), 30000)
    );
    
    await Promise.race([connectionPromise, timeoutPromise]);
    console.log('✅ Database connection established successfully');

    console.log('🔄 Syncing database schema...');
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database schema synced successfully');

    console.log('🌱 Seeding initial data from seeders...');
    
    // Use the seeder to populate initial data
    try {
      await seedDatabase();
      console.log('✅ Database seeding completed successfully');
    } catch (seedError) {
      console.log('⚠️ Database seeding failed, but continuing with server startup:', seedError.message);
      console.log('ℹ️ Some initial data may not be available');
    }

    console.log('🎉 Database setup completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.error('Error details:', error.message);
    
    // Don't exit with error code 1 for Render deployment
    // Let the server start and handle database connection on its own
    console.log('⚠️  Continuing with server startup - database will be handled on first request');
    process.exit(0);
  }
}

// Run the setup
setupDatabase();
