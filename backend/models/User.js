import db from '../db/connection.js';
import bcrypt from 'bcryptjs';

class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
    this.memberId = data.memberId; // Link to member profile
    this.isActive = data.isActive;
    this.lastLogin = data.lastLogin;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Static methods for database operations

  // Get all users (admin only)
  static async findAll() {
    try {
      const users = await db('users')
        .select('id', 'username', 'email', 'role', 'memberId', 'isActive', 'lastLogin', 'created_at', 'updated_at')
        .orderBy('created_at', 'desc');
      
      return users.map(user => new User(user));
    } catch (error) {
      console.error('Error in User.findAll:', error);
      throw error;
    }
  }

  // Get user by ID
  static async findById(id) {
    try {
      const user = await db('users').where('id', id).first();
      return user ? new User(user) : null;
    } catch (error) {
      console.error('Error in User.findById:', error);
      throw error;
    }
  }

  // Get user by username
  static async findByUsername(username) {
    try {
      const user = await db('users').where('username', username).first();
      return user ? new User(user) : null;
    } catch (error) {
      console.error('Error in User.findByUsername:', error);
      throw error;
    }
  }

  // Get user by email
  static async findByEmail(email) {
    try {
      const user = await db('users').where('email', email).first();
      return user ? new User(user) : null;
    } catch (error) {
      console.error('Error in User.findByEmail:', error);
      throw error;
    }
  }

  // Get user by member ID
  static async findByMemberId(memberId) {
    try {
      const user = await db('users').where('memberId', memberId).first();
      return user ? new User(user) : null;
    } catch (error) {
      console.error('Error in User.findByMemberId:', error);
      throw error;
    }
  }

  // Create new user
  static async create(userData) {
    try {
      // Hash password if provided
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 12);
      }

      const [newUser] = await db('users')
        .insert(userData)
        .returning('*');
      
      return new User(newUser);
    } catch (error) {
      console.error('Error in User.create:', error);
      throw error;
    }
  }

  // Update user
  async update(updateData) {
    try {
      // Hash password if it's being updated
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      }

      const [updatedUser] = await db('users')
        .where('id', this.id)
        .update({
          ...updateData,
          updated_at: new Date()
        })
        .returning('*');
      
      // Update current instance
      Object.assign(this, updatedUser);
      return this;
    } catch (error) {
      console.error('Error in User.update:', error);
      throw error;
    }
  }

  // Delete user
  async delete() {
    try {
      const deletedCount = await db('users').where('id', this.id).del();
      return deletedCount > 0;
    } catch (error) {
      console.error('Error in User.delete:', error);
      throw error;
    }
  }

  // Authenticate user (login)
  static async authenticate(username, password) {
    try {
      const user = await this.findByUsername(username);
      if (!user || !user.isActive) {
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return null;
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      return user;
    } catch (error) {
      console.error('Error in User.authenticate:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, this.password);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash and update new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await this.update({ password: hashedPassword });

      return true;
    } catch (error) {
      console.error('Error in User.changePassword:', error);
      throw error;
    }
  }

  // Utility methods

  // Check if user has specific role
  hasRole(role) {
    return this.role === role;
  }

  // Check if user is admin
  isAdmin() {
    return this.role === 'admin';
  }

  // Check if user is active
  isUserActive() {
    return this.isActive === true;
  }

  // Get user without sensitive data
  toSafeJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
      memberId: this.memberId,
      isActive: this.isActive,
      lastLogin: this.lastLogin,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // Convert to plain object (includes password for internal use)
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role,
      memberId: this.memberId,
      isActive: this.isActive,
      lastLogin: this.lastLogin,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

export default User;
