import db from '../db/connection.js';

class GalleryImage {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.category = data.category;
    this.description = data.description;
    this.imageUrl = data.imageUrl;
    this.tags = typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags;
    this.featured = data.featured;
    this.location = data.location;
    this.members = typeof data.members === 'string' ? JSON.parse(data.members) : data.members;
    this.date = data.date;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Static methods for database operations

  // Get all images with optional filtering
  static async findAll(filters = {}) {
    try {
      let query = db('gallery_images').select('*');

      // Apply filters
      if (filters.category && filters.category !== 'all') {
        query = query.where('category', filters.category);
      }

      if (filters.featured !== undefined) {
        query = query.where('featured', filters.featured);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        query = query.where(function() {
          this.where('title', 'like', `%${searchTerm}%`)
            .orWhere('description', 'like', `%${searchTerm}%`)
            .orWhere('location', 'like', `%${searchTerm}%`)
            .orWhereRaw("tags LIKE ?", [`%${searchTerm}%`])
            .orWhereRaw("members LIKE ?", [`%${searchTerm}%`]);
        });
      }

      if (filters.member) {
        query = query.whereRaw("members LIKE ?", [`%${filters.member}%`]);
      }

      if (filters.startDate && filters.endDate) {
        query = query.whereBetween('date', [filters.startDate, filters.endDate]);
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'date';
      const sortOrder = filters.sortOrder || 'desc';
      query = query.orderBy(sortBy, sortOrder);

      // Apply pagination
      if (filters.page && filters.itemsPerPage) {
        const offset = (filters.page - 1) * filters.itemsPerPage;
        query = query.limit(filters.itemsPerPage).offset(offset);
      }

      const images = await query;
      return images.map(image => new GalleryImage(image));
    } catch (error) {
      console.error('Error in GalleryImage.findAll:', error);
      throw error;
    }
  }

  // Get image by ID
  static async findById(id) {
    try {
      const image = await db('gallery_images').where('id', id).first();
      return image ? new GalleryImage(image) : null;
    } catch (error) {
      console.error('Error in GalleryImage.findById:', error);
      throw error;
    }
  }

  // Create new image
  static async create(imageData) {
    try {
      console.log('🔍 GalleryImage.create called with data:', imageData);
      
      // Ensure tags and members are stored as JSON strings for SQLite
      const dataToInsert = {
        ...imageData,
        tags: Array.isArray(imageData.tags) ? JSON.stringify(imageData.tags) : imageData.tags,
        members: Array.isArray(imageData.members) ? JSON.stringify(imageData.members) : imageData.members
      };

      console.log('🔍 Data to insert:', dataToInsert);

      // SQLite compatible insert
      const [insertedId] = await db('gallery_images').insert(dataToInsert);
      
      console.log('🔍 Inserted ID:', insertedId);
      
      // Fetch the newly created image
      const [newImage] = await db('gallery_images').where('id', insertedId);
      
      console.log('🔍 New image fetched:', newImage);
      
      return new GalleryImage(newImage);
    } catch (error) {
      console.error('❌ Error in GalleryImage.create:', error);
      throw error;
    }
  }

  // Update image
  async update(updateData) {
    try {
      console.log('🔍 GalleryImage.update called with data:', updateData);
      
      // Ensure tags and members are stored as JSON strings for SQLite
      const dataToUpdate = {
        ...updateData,
        tags: Array.isArray(updateData.tags) ? JSON.stringify(updateData.tags) : updateData.tags,
        members: Array.isArray(updateData.members) ? JSON.stringify(updateData.members) : updateData.members,
        updated_at: new Date()
      };

      console.log('🔍 Data to update:', dataToUpdate);

      // SQLite compatible update
      await db('gallery_images').where('id', this.id).update(dataToUpdate);
      
      // Fetch the updated image
      const [updatedImage] = await db('gallery_images').where('id', this.id);
      
      console.log('🔍 Updated image fetched:', updatedImage);
      
      // Update current instance
      Object.assign(this, updatedImage);
      return this;
    } catch (error) {
      console.error('❌ Error in GalleryImage.update:', error);
      throw error;
    }
  }

  // Delete image
  async delete() {
    try {
      const deletedCount = await db('gallery_images').where('id', this.id).del();
      return deletedCount > 0;
    } catch (error) {
      console.error('Error in GalleryImage.delete:', error);
      throw error;
    }
  }

  // Utility methods

  // Get all unique categories
  static async getCategories() {
    try {
      const categories = await db('gallery_images')
        .distinct('category')
        .orderBy('category', 'asc');
      
      return categories.map(c => c.category);
    } catch (error) {
      console.error('Error in GalleryImage.getCategories:', error);
      throw error;
    }
  }

  // Get featured images
  static async getFeatured() {
    try {
      const images = await db('gallery_images')
        .where('featured', true)
        .orderBy('date', 'desc');
      
      return images.map(image => new GalleryImage(image));
    } catch (error) {
      console.error('Error in GalleryImage.getFeatured:', error);
      throw error;
    }
  }

  // Get images by category
  static async findByCategory(category) {
    try {
      const images = await db('gallery_images')
        .where('category', category)
        .orderBy('date', 'desc');
      
      return images.map(image => new GalleryImage(image));
    } catch (error) {
      console.error('Error in GalleryImage.findByCategory:', error);
      throw error;
    }
  }

  // Get images by member
  static async findByMember(memberName) {
    try {
      const images = await db('gallery_images')
        .whereRaw("members LIKE ?", [`%${memberName}%`])
        .orderBy('date', 'desc');
      
      return images.map(image => new GalleryImage(image));
    } catch (error) {
      console.error('Error in GalleryImage.findByMember:', error);
      throw error;
    }
  }

  // Get images by tag
  static async findByTag(tag) {
    try {
      const images = await db('gallery_images')
        .whereRaw("tags LIKE ?", [`%${tag}%`])
        .orderBy('date', 'desc');
      
      return images.map(image => new GalleryImage(image));
    } catch (error) {
      console.error('Error in GalleryImage.findByTag:', error);
      throw error;
    }
  }

  // Get images by date range
  static async findByDateRange(startDate, endDate) {
    try {
      const images = await db('gallery_images')
        .whereBetween('date', [startDate, endDate])
        .orderBy('date', 'desc');
      
      return images.map(image => new GalleryImage(image));
    } catch (error) {
      console.error('Error in GalleryImage.findByDateRange:', error);
      throw error;
    }
  }

  // Get category statistics
  static async getCategoryStats() {
    try {
      const stats = await db('gallery_images')
        .select('category')
        .count('* as count')
        .groupBy('category');
      
      return stats.map(stat => ({
        category: stat.category,
        count: stat.count
      }));
    } catch (error) {
      console.error('Error in GalleryImage.getCategoryStats:', error);
      throw error;
    }
  }

  // Get total count
  static async getCount(filters = {}) {
    try {
      let query = db('gallery_images').count('* as count');

      // Apply same filters as findAll
      if (filters.category && filters.category !== 'all') {
        query = query.where('category', filters.category);
      }

      if (filters.featured !== undefined) {
        query = query.where('featured', filters.featured);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        query = query.where(function() {
          this.where('title', 'like', `%${searchTerm}%`)
            .orWhere('description', 'like', `%${searchTerm}%`)
            .orWhere('location', 'like', `%${searchTerm}%`)
            .orWhereRaw("tags LIKE ?", [`%${searchTerm}%`])
            .orWhereRaw("members LIKE ?", [`%${searchTerm}%`]);
        });
      }

      const result = await query.first();
      return result.count;
    } catch (error) {
      console.error('Error in GalleryImage.getCount:', error);
      throw error;
    }
  }

  // Instance methods

  // Check if image is featured
  isFeatured() {
    return this.featured === true;
  }

  // Check if image has tags
  hasTags() {
    return Array.isArray(this.tags) && this.tags.length > 0;
  }

  // Check if image has members
  hasMembers() {
    return Array.isArray(this.members) && this.members.length > 0;
  }

  // Check if image has a specific tag
  hasTag(tag) {
    return this.hasTags() && this.tags.some(t => t.toLowerCase() === tag.toLowerCase());
  }

  // Check if image has a specific member
  hasMember(memberName) {
    return this.hasMembers() && this.members.some(m => 
      m.toLowerCase().includes(memberName.toLowerCase())
    );
  }

  // Get formatted date
  getFormattedDate() {
    return new Date(this.date).toLocaleDateString();
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      category: this.category,
      description: this.description,
      imageUrl: this.imageUrl,
      tags: this.tags,
      featured: this.featured,
      location: this.location,
      members: this.members,
      date: this.date,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

export default GalleryImage;
