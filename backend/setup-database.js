#!/usr/bin/env node

import { sequelize } from './db/connection.js';
import { Member, GalleryImage, User } from './models/index.js';

console.log('🚀 Starting database setup for Render deployment...');

async function setupDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    console.log('🔄 Syncing database schema...');
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database schema synced successfully');

    console.log('🌱 Seeding initial data...');
    
    // Check if we already have data
    const memberCount = await Member.count();
    const imageCount = await GalleryImage.count();
    const userCount = await User.count();

    if (memberCount === 0) {
      console.log('📝 Creating initial members...');
      await Member.bulkCreate([
        {
          name: 'John Doe',
          roadname: 'Road Warrior',
          rank: 'President',
          chapter: 'Dockside',
          bio: 'Founding member and current President of Unholy Souls MC.',
          join_date: new Date('2020-01-01'),
          is_active: true
        },
        {
          name: 'Jane Smith',
          roadname: 'Iron Maiden',
          rank: 'Vice President',
          chapter: 'Dockside',
          bio: 'Vice President and founding member.',
          join_date: new Date('2020-01-01'),
          is_active: true
        }
      ]);
      console.log('✅ Initial members created');
    } else {
      console.log(`ℹ️  ${memberCount} members already exist, skipping member creation`);
    }

    if (imageCount === 0) {
      console.log('🖼️  Creating initial gallery images...');
      await GalleryImage.bulkCreate([
        {
          title: 'Club House',
          category: 'Other',
          description: 'Our main club house where brothers gather.',
          image_url: 'https://via.placeholder.com/800x600/333333/FFFFFF?text=Club+House',
          tags: ['clubhouse', 'brotherhood'],
          featured: true,
          date: new Date()
        }
      ]);
      console.log('✅ Initial gallery images created');
    } else {
      console.log(`ℹ️  ${imageCount} gallery images already exist, skipping image creation`);
    }

    if (userCount === 0) {
      console.log('👤 Creating initial admin user...');
      await User.create({
        username: 'admin',
        email: 'admin@unholysoulsmc.com',
        password: 'admin123', // This should be changed in production
        role: 'admin',
        isActive: true
      });
      console.log('✅ Initial admin user created (username: admin, password: admin123)');
    } else {
      console.log(`ℹ️  ${userCount} users already exist, skipping user creation`);
    }

    console.log('🎉 Database setup completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
