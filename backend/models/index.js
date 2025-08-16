import sequelize from '../db/connection.js';
import User from './User.js';
import Member from './Member.js';
import GalleryImage from './GalleryImage.js';

// Define associations
User.belongsTo(Member, { 
  foreignKey: 'memberId', 
  as: 'member',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

Member.hasOne(User, { 
  foreignKey: 'memberId', 
  as: 'user',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

// Export all models and sequelize instance
export {
  sequelize,
  User,
  Member,
  GalleryImage
};

export default sequelize;
