import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection.js';

class GalleryImage extends Model {
  // Instance methods
  isFeatured() {
    return this.featured === true;
  }

  hasTags() {
    return Array.isArray(this.tags) && this.tags.length > 0;
  }

  hasMembers() {
    return Array.isArray(this.members) && this.members.length > 0;
  }

  hasTag(tag) {
    return this.hasTags() && this.tags.some(t => t.toLowerCase() === tag.toLowerCase());
  }

  hasMember(memberName) {
    return this.hasMembers() && this.members.some(m => 
      m.toLowerCase().includes(memberName.toLowerCase())
    );
  }

  getFormattedDate() {
    return new Date(this.date).toLocaleDateString();
  }

  toJSON() {
    const data = super.toJSON();
    return {
      ...data,
      isFeatured: this.isFeatured(),
      hasTags: this.hasTags(),
      hasMembers: this.hasMembers(),
      formattedDate: this.getFormattedDate()
    };
  }
}

GalleryImage.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  category: {
    type: DataTypes.ENUM('Club', 'National', 'Dockside', 'Bay City', 'Event', 'Other'),
    allowNull: false,
    defaultValue: 'Other'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 1000]
    }
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      isUrl: true
    }
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  members: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'GalleryImage',
  tableName: 'gallery_images',
  timestamps: true,
  underscored: true
});

export default GalleryImage;
