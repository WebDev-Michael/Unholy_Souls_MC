import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection.js';

class Member extends Model {
  // Instance methods
  getFullName() {
    return this.roadname ? `${this.name} "${this.roadname}"` : this.name;
  }

  isFullPatch() {
    return this.rank === 'Full Patch Member';
  }

  toJSON() {
    const data = super.toJSON();
    return {
      ...data,
      fullName: this.getFullName(),
      isFullPatch: this.isFullPatch()
    };
  }
}

Member.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  roadname: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: [1, 50]
    }
  },
  rank: {
    type: DataTypes.ENUM(
      'Prospect',
      'Full Patch Member',
      'Tail Gunner',
      'Enforcer',
      'Warlord',
      'Treasurer',
      'Secretary',
      'Road Captain',
      'Sergeant at Arms',
      'Vice President',
      'President'
    ),
    allowNull: false,
    defaultValue: 'Prospect'
  },
  chapter: {
    type: DataTypes.ENUM(
      'Dockside',
      'Bay City',
      'National'
    ),
    allowNull: false,
    defaultValue: 'Dockside'
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 2000]
    }
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  joinDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Member',
  tableName: 'members',
  timestamps: true,
  underscored: true
});

export default Member;
