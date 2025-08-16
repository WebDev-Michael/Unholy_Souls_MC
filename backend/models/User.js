import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../db/connection.js';

class User extends Model {
  // Instance methods
  async validatePassword(password) {
    return bcrypt.compare(password, this.password);
  }

  toSafeJSON() {
    const { password, ...safeData } = this.toJSON();
    return safeData;
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'member', 'guest'),
    allowNull: false,
    defaultValue: 'member'
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'members',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password && !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$') && !user.password.startsWith('$2y$')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password') && !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$') && !user.password.startsWith('$2y$')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

// Static methods
User.authenticate = async function(username, password) {
  try {
    const user = await this.findOne({ 
      where: { username, isActive: true }
    });

    if (user && await user.validatePassword(password)) {
      // Update last login
      await user.update({ lastLogin: new Date() });
      return user;
    }
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

User.findByUsername = function(username) {
  return this.findOne({ where: { username } });
};

User.findByEmail = function(email) {
  return this.findOne({ where: { email } });
};

export default User;
