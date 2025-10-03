import bcrypt from 'bcryptjs';
import { Member, User, GalleryImage } from '../models/index.js';

export async function up() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Create initial members
    console.log('👥 Creating members...');
    const members = await Member.bulkCreate([
      {
        name: 'John "Reaper" Smith',
        roadname: 'Reaper',
        rank: 'President',
        chapter: 'Dockside',
        bio: 'Founding member and current President of Unholy Souls MC. Known for his leadership and dedication to the club.',
        image: 'https://example.com/images/reaper.jpg',
        joinDate: new Date('2020-01-01'),
        isActive: true
      },
      {
        name: 'Mike "Shadow" Johnson',
        roadname: 'Shadow',
        rank: 'Vice President',
        chapter: 'Dockside',
        bio: 'Vice President and trusted advisor. Handles club operations and member relations.',
        image: 'https://example.com/images/shadow.jpg',
        joinDate: new Date('2020-02-01'),
        isActive: true
      },
      {
        name: 'David "Bones" Williams',
        roadname: 'Bones',
        rank: 'Full Patch Member',
        chapter: 'National',
        bio: 'Full patch member with a passion for long rides and club brotherhood.',
        image: 'https://example.com/images/bones.jpg',
        joinDate: new Date('2020-03-01'),
        isActive: true
      },
      {
        name: 'Chris "Ghost" Brown',
        roadname: 'Ghost',
        rank: 'Full Patch Member',
        chapter: 'Bay City',
        bio: 'Dedicated member known for his mechanical skills and loyalty to the club.',
        image: 'https://example.com/images/ghost.jpg',
        joinDate: new Date('2020-04-01'),
        isActive: true
      },
      {
        name: 'Alex "Raven" Davis',
        roadname: 'Raven',
        rank: 'Prospect',
        chapter: 'Dockside',
        bio: 'New prospect showing great potential and dedication to earning his patch.',
        image: 'https://example.com/images/raven.jpg',
        joinDate: new Date('2024-01-01'),
        isActive: true
      }
    ]);

    console.log(`✅ Created ${members.length} members`);

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('UnholySouls2025!', 10);
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@unholysoulsmc.com',
      password: hashedPassword,
      role: 'admin',
      memberId: members[0].id, // Link to Reaper
      isActive: true,
      lastLogin: new Date()
    });

    console.log('✅ Created admin user');

    // Create gallery images
    console.log('🖼️ Creating gallery images...');
    await GalleryImage.bulkCreate([
      {
        title: 'Club Meeting at Dockside',
        category: 'Club',
        description: 'Monthly club meeting at our Dockside chapter headquarters.',
        imageUrl: 'https://example.com/images/club-meeting.jpg',
        tags: ['meeting', 'dockside', 'club'],
        featured: true,
        location: 'Dockside Chapter HQ',
        members: ['Reaper', 'Shadow', 'Bones'],
        date: '2024-01-15'
      },
      {
        title: 'National Ride 2024',
        category: 'National',
        description: 'Annual national ride through the mountains with all chapters.',
        imageUrl: 'https://example.com/images/national-ride.jpg',
        tags: ['ride', 'national', 'mountains'],
        featured: true,
        location: 'Mountain Pass',
        members: ['Reaper', 'Shadow', 'Bones', 'Ghost'],
        date: '2024-02-20'
      },
      {
        title: 'Charity Event',
        category: 'Event',
        description: 'Supporting local community through charity motorcycle ride.',
        imageUrl: 'https://example.com/images/charity-event.jpg',
        tags: ['charity', 'community', 'event'],
        featured: false,
        location: 'Community Center',
        members: ['Reaper', 'Shadow', 'Bones', 'Ghost', 'Raven'],
        date: '2024-03-10'
      }
    ]);

    console.log('✅ Created gallery images');
    console.log('🎉 Database seeding completed successfully!');
    
    return { members, adminUser };
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

export async function down() {
  try {
    console.log('🧹 Starting database cleanup...');
    
    // Remove all data in reverse order
    await GalleryImage.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Member.destroy({ where: {} });
    
    console.log('✅ Database cleanup completed');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

// If running standalone
if (import.meta.url === `file://${process.argv[1]}`) {
  up()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}
