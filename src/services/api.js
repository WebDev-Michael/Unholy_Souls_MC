const API_BASE_URL = 'http://localhost:5000';

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

// Authentication API calls
export const authAPI = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
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

    const response = await fetch(`${API_BASE_URL}/meetthesouls?${params}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getRanks: async () => {
    const response = await fetch(`${API_BASE_URL}/meetthesouls/ranks`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getChapters: async () => {
    const response = await fetch(`${API_BASE_URL}/meetthesouls/chapters`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Gallery API calls
export const galleryAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.featured !== undefined) params.append('featured', filters.featured);
    if (filters.search) params.append('search', filters.search);
    if (filters.member) params.append('member', filters.member);
    if (filters.page) params.append('page', filters.page);
    if (filters.itemsPerPage) params.append('itemsPerPage', filters.itemsPerPage);

    const response = await fetch(`${API_BASE_URL}/gallery?${params}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/gallery/categories`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Admin API calls
export const adminAPI = {
  // Gallery Management
  getGallery: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/gallery`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  createGalleryImage: async (imageData) => {
    const response = await fetch(`${API_BASE_URL}/admin/gallery`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(imageData)
    });
    return handleResponse(response);
  },

  updateGalleryImage: async (id, imageData) => {
    const response = await fetch(`${API_BASE_URL}/admin/gallery/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(imageData)
    });
    return handleResponse(response);
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
    return handleResponse(response);
  },

  createMember: async (memberData) => {
    const response = await fetch(`${API_BASE_URL}/admin/members`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(memberData)
    });
    return handleResponse(response);
  },

  updateMember: async (id, memberData) => {
    const response = await fetch(`${API_BASE_URL}/admin/members/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(memberData)
    });
    return handleResponse(response);
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
    return handleResponse(response);
  },

  createUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  updateUser: async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
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
  const response = await fetch('http://localhost:5000/health');
  return handleResponse(response);
};

export default {
  auth: authAPI,
  members: membersAPI,
  gallery: galleryAPI,
  admin: adminAPI,
  healthCheck
};
