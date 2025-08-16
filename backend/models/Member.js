import db from '../db/connection.js';

class Member {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.roadname = data.roadname;
    this.rank = data.rank;
    this.chapter = data.chapter;
    this.bio = data.bio;
    this.image = data.image;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Static methods for database operations

  // Get all members with optional filtering
  static async findAll(filters = {}) {
    try {
      let query = db('members').select('*');

      // Apply filters
      if (filters.rank) {
        query = query.where('rank', filters.rank);
      }

      if (filters.chapter) {
        query = query.where('chapter', filters.chapter);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        query = query.where(function() {
          this.where('name', 'like', `%${searchTerm}%`)
            .orWhere('roadname', 'like', `%${searchTerm}%`)
            .orWhere('rank', 'like', `%${searchTerm}%`)
            .orWhere('chapter', 'like', `%${searchTerm}%`)
            .orWhere('bio', 'like', `%${searchTerm}%`);
        });
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'rank';
      const sortOrder = filters.sortOrder || 'asc';
      query = query.orderBy(sortBy, sortOrder);

      if (sortBy === 'rank') {
        query = query.orderBy('name', 'asc'); // Secondary sort by name
      }

      const members = await query;
      return members.map(member => new Member(member));
    } catch (error) {
      console.error('Error in Member.findAll:', error);
      throw error;
    }
  }

  // Get member by ID
  static async findById(id) {
    try {
      const member = await db('members').where('id', id).first();
      return member ? new Member(member) : null;
    } catch (error) {
      console.error('Error in Member.findById:', error);
      throw error;
    }
  }

  // Create new member
  static async create(memberData) {
    try {
      const [newMember] = await db('members')
        .insert(memberData)
        .returning('*');
      
      return new Member(newMember);
    } catch (error) {
      console.error('Error in Member.create:', error);
      throw error;
    }
  }

  // Update member
  async update(updateData) {
    try {
      const [updatedMember] = await db('members')
        .where('id', this.id)
        .update({
          ...updateData,
          updated_at: new Date()
        })
        .returning('*');
      
      // Update current instance
      Object.assign(this, updatedMember);
      return this;
    } catch (error) {
      console.error('Error in Member.update:', error);
      throw error;
    }
  }

  // Delete member
  async delete() {
    try {
      const deletedCount = await db('members').where('id', this.id).del();
      return deletedCount > 0;
    } catch (error) {
      console.error('Error in Member.delete:', error);
      throw error;
    }
  }

  // Utility methods

  // Get all unique ranks
  static async getRanks() {
    try {
      const ranks = await db('members')
        .distinct('rank')
        .orderBy('rank', 'asc');
      
      return ranks.map(r => r.rank);
    } catch (error) {
      console.error('Error in Member.getRanks:', error);
      throw error;
    }
  }

  // Get all unique chapters
  static async getChapters() {
    try {
      const chapters = await db('members')
        .distinct('chapter')
        .orderBy('chapter', 'asc');
      
      return chapters.map(c => c.chapter);
    } catch (error) {
      console.error('Error in Member.getChapters:', error);
      throw error;
    }
  }

  // Get members by rank
  static async findByRank(rank) {
    try {
      const members = await db('members')
        .where('rank', rank)
        .orderBy('name', 'asc');
      
      return members.map(member => new Member(member));
    } catch (error) {
      console.error('Error in Member.findByRank:', error);
      throw error;
    }
  }

  // Get members by chapter
  static async findByChapter(chapter) {
    try {
      const members = await db('members')
        .where('chapter', chapter)
        .orderBy('rank', 'asc')
        .orderBy('name', 'asc');
      
      return members.map(member => new Member(member));
    } catch (error) {
      console.error('Error in Member.findByChapter:', error);
      throw error;
    }
  }

  // Get members with roadnames
  static async findWithRoadnames() {
    try {
      const members = await db('members')
        .whereNotNull('roadname')
        .orderBy('name', 'asc');
      
      return members.map(member => new Member(member));
    } catch (error) {
      console.error('Error in Member.findWithRoadnames:', error);
      throw error;
    }
  }

  // Get members with images
  static async findWithImages() {
    try {
      const members = await db('members')
        .whereNotNull('image')
        .orderBy('name', 'asc');
      
      return members.map(member => new Member(member));
    } catch (error) {
      console.error('Error in Member.findWithImages:', error);
      throw error;
    }
  }

  // Get dashboard statistics
  static async getDashboardStats() {
    try {
      const totalMembers = await db('members').count('* as count').first();
      const membersByChapter = await db('members')
        .select('chapter')
        .count('* as count')
        .groupBy('chapter');
      
      const membersByRank = await db('members')
        .select('rank')
        .count('* as count')
        .groupBy('rank');

      return {
        totalMembers: totalMembers.count,
        membersByChapter,
        membersByRank
      };
    } catch (error) {
      console.error('Error in Member.getDashboardStats:', error);
      throw error;
    }
  }

  // Instance methods

  // Check if member has a roadname
  hasRoadname() {
    return this.roadname !== null && this.roadname.trim() !== '';
  }

  // Check if member has an image
  hasImage() {
    return this.image !== null && this.image.trim() !== '';
  }

  // Get display name (roadname if available, otherwise name)
  getDisplayName() {
    return this.hasRoadname() ? `${this.name} - ${this.roadname}` : this.name;
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      roadname: this.roadname,
      rank: this.rank,
      chapter: this.chapter,
      bio: this.bio,
      image: this.image,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

export default Member;
