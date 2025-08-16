const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to process Sequelize response data
const processSequelizeResponse = (data) => {
  // Handle both single objects and arrays
  if (Array.isArray(data)) {
    return data.map(item => processSequelizeItem(item));
  }
  return processSequelizeItem(data);
};

// Helper function to process individual Sequelize items
const processSequelizeItem = (item) => {
  if (!item || typeof item !== 'object') return item;
  
  // Convert Sequelize snake_case to camelCase if needed
  const processed = { ...item };
  
  // Handle common Sequelize field transformations
  if (processed.created_at) {
    processed.createdAt = processed.created_at;
    delete processed.created_at;
  }
  if (processed.updated_at) {
    processed.updatedAt = processed.updated_at;
    delete processed.updated_at;
  }
  if (processed.image_url) {
    processed.imageUrl = processed.image_url;
    delete processed.image_url;
  }
  if (processed.join_date) {
    processed.joinDate = processed.join_date;
    delete processed.join_date;
  }
  if (processed.is_active) {
    processed.isActive = processed.is_active;
    delete processed.is_active;
  }
  if (processed.last_login) {
    processed.lastLogin = processed.last_login;
    delete processed.last_login;
  }
  if (processed.member_id) {
    processed.memberId = processed.member_id;
    delete processed.member_id;
  }
  
  return processed;
};

// Authentication API calls
export const authAPI = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await handleResponse(response);
    return processSequelizeResponse(data);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await handleResponse(response);
    return processSequelizeResponse(data);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Members API calls
export const membersAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.rank) params.append('rank', filters.rank);
    if (filters.chapter) params.append('chapter', filters.chapter);
    if (filters.search) params.append('search', filters.search);

    // Public endpoint - no authentication required
    const response = await fetch(`${API_BASE_URL}/meetthesouls?${params}`);
    const data = await handleResponse(response);
    return processSequelizeResponse(data);
  },

  getRanks: async () => {
    // Public endpoint - no authentication required
    const response = await fetch(`${API_BASE_URL}/meetthesouls/ranks`);
    const data = await handleResponse(response);
    // Process Sequelize aggregation response
    return data.map(item => ({
      rank: item.rank,
      count: parseInt(item.count) || 0
    }));
  },

  getChapters: async () => {
    // Public endpoint - no authentication required
    const response = await fetch(`${API_BASE_URL}/meetthesouls/chapters`);
    const data = await handleResponse(response);
    // Process Sequelize aggregation response
    return data.map(item => ({
      chapter: item.chapter,
      count: parseInt(item.count) || 0
    }));
  }
};

// Gallery API calls
export const galleryAPI = {
  getAll: async (filters = {}) => {
    console.log('🔍 Gallery API getAll called with filters:', filters);
    
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.featured !== undefined) params.append('featured', filters.featured);
    if (filters.search) params.append('search', filters.search);
    if (filters.member) params.append('member', filters.member);
    if (filters.page) params.append('page', filters.page);
    if (filters.itemsPerPage) params.append('itemsPerPage', filters.itemsPerPage);

    const url = `${API_BASE_URL}/gallery?${params}`;
    console.log('🔍 Fetching from URL:', url);
    
    // Public endpoint - no authentication required
    const response = await fetch(url);
    console.log('🔍 Gallery response status:', response.status);
    console.log('🔍 Gallery response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await handleResponse(response);
    return processSequelizeResponse(data);
  },

  getCategories: async () => {
    console.log('🔍 Gallery API getCategories called');
    const url = `${API_BASE_URL}/gallery/categories`;
    console.log('🔍 Fetching from URL:', url);
    
    // Public endpoint - no authentication required
    const response = await fetch(url);
    console.log('🔍 Categories response status:', response.status);
    console.log('🔍 Categories response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await handleResponse(response);
    // Process Sequelize aggregation response
    return data.map(item => ({
      category: item.category,
      count: parseInt(item.count) || 0
    }));
  }
};

// Admin API calls
export const adminAPI = {
  // Gallery Management
  getGallery: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/gallery`, {
      headers: getAuthHeaders()
    });
    const data = await handleResponse(response);
    return processSequelizeResponse(data);
  },

  createGalleryImage: async (imageData) => {
    console.log('🔍 API createGalleryImage called with data:', imageData);
    
    // Ensure all required fields are present and properly formatted
    if (!imageData.title || !imageData.category || !imageData.description || !imageData.imageUrl) {
      throw new Error('Missing required fields: title, category, description, and imageUrl are required');
    }
    
    const processedData = {
      title: imageData.title.trim(),
      category: imageData.category,
      description: imageData.description.trim(),
      imageUrl: imageData.imageUrl.trim(),
      tags: Array.isArray(imageData.tags) ? imageData.tags : 
            (typeof imageData.tags === 'string' ? imageData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []),
      featured: Boolean(imageData.featured),
      location: imageData.location || null,
      members: Array.isArray(imageData.members) ? imageData.members : 
              (typeof imageData.members === 'string' ? imageData.members.split(',').map(member => member.trim()).filter(member => member) : []),
      date: imageData.date || new Date().toISOString().split('T')[0]
    };
    
    console.log('🔍 Sending processed data:', processedData);
    
    const response = await fetch(`${API_BASE_URL}/admin/gallery`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(processedData)
    });
    
    console.log('🔍 Create gallery image response status:', response.status);
    console.log('🔍 Create gallery image response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await handleResponse(response);
    return processSequelizeResponse(data);
  },

  updateGalleryImage: async (id, imageData) => {
    console.log('🔍 API updateGalleryImage called with ID:', id);
    console.log('🔍 API updateGalleryImage data:', imageData);
    
    // Ensure all required fields are present and properly formatted
    if (!imageData.title || !imageData.category || !imageData.description || !imageData.imageUrl) {
      throw new Error('Missing required fields: title, category, description, and imageUrl are required');
    }
    
    // Ensure data is compatible with Sequelize model
    const processedData = {
      title: imageData.title.trim(),
      category: imageData.category,
      description: imageData.description.trim(),
      imageUrl: imageData.imageUrl.trim(),
      tags: Array.isArray(imageData.tags) ? imageData.tags : 
            (typeof imageData.tags === 'string' ? imageData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []),
      featured: Boolean(imageData.featured),
      location: imageData.location || null,
      members: Array.isArray(imageData.members) ? imageData.members : 
              (typeof imageData.members === 'string' ? imageData.members.split(',').map(member => member.trim()).filter(member => member) : []),
      date: imageData.date || new Date().toISOString().split('T')[0]
    };

    console.log('🔍 Sending processed data:', processedData);

    const response = await fetch(`${API_BASE_URL}/admin/gallery/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(processedData)
    });
    
    console.log('🔍 Update gallery image response status:', response.status);
    console.log('🔍 Update gallery image response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await handleResponse(response);
    return processSequelizeResponse(data);
  },

  deleteGalleryImage: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Member Management
  getMembers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/members`, {
      headers: getAuthHeaders()
    });
    const data = await handleResponse(response);
    return processSequelizeResponse(data);
  },

  createMember: async (memberData) => {
    // Ensure data is compatible with Sequelize model
    const processedData = {
      name: memberData.name,
      roadname: memberData.roadname || null,
      rank: memberData.rank,
      chapter: memberData.chapter,
      bio: memberData.bio,
      image: memberData.image || null,
      joinDate: memberData.joinDate || new Date().toISOString(),
      isActive: true
    };

    const response = await fetch(`${API_BASE_URL}/admin/members`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(processedData)
    });
    const data = await handleResponse(response);
    return processSequelizeResponse(data);
  },

  updateMember: async (id, memberData) => {
    console.log('🔍 API updateMember called with ID:', id);
    console.log('🔍 API updateMember data:', memberData);
    
    // Ensure data is compatible with Sequelize model
    const processedData = {
      name: memberData.name,
      roadname: memberData.roadname || null,
      rank: memberData.rank,
      chapter: memberData.chapter,
      bio: memberData.bio,
      image: memberData.image || null,
      joinDate: memberData.joinDate || new Date().toISOString(),
      isActive: memberData.isActive !== undefined ? memberData.isActive : true
    };
    
    const response = await fetch(`${API_BASE_URL}/admin/members/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(processedData)
    });
    
    console.log('🔍 API updateMember response status:', response.status);
    const data = await handleResponse(response);
    return processSequelizeResponse(data);
  },

  deleteMember: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/members/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // User Management
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders()
    });
    const data = await handleResponse(response);
    return processSequelizeResponse(data);
  },

  createUser: async (userData) => {
    // Ensure data is compatible with Sequelize model
    const processedData = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'member',
      memberId: userData.memberId || null,
      isActive: userData.isActive !== undefined ? userData.isActive : true
    };

    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(processedData)
    });
    const data = await handleResponse(response);
    return processSequelizeResponse(data);
  },

  updateUser: async (id, userData) => {
    // Ensure data is compatible with Sequelize model
    const processedData = {
      username: userData.username,
      email: userData.email,
      role: userData.role,
      memberId: userData.memberId || null,
      isActive: userData.isActive !== undefined ? userData.isActive : true
    };

    // Only include password if it's being updated
    if (userData.password) {
      processedData.password = userData.password;
    }

    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(processedData)
    });
    const data = await handleResponse(response);
    return processSequelizeResponse(data);
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
};

export default {
  auth: authAPI,
  members: membersAPI,
  gallery: galleryAPI,
  admin: adminAPI,
  healthCheck
};
