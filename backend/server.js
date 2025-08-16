import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Member, GalleryImage, User } from './models/index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Vite default port
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/', limiter);

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Admin role check middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Unholy Souls MC Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Authentication routes
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.authenticate(username, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        memberId: user.memberId 
      }, 
      secret, 
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: user.toSafeJSON()
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, password, memberId } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if username or email already exists
    const existingUser = await User.findByUsername(username) || await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create new user
    const userData = {
      username,
      email,
      password,
      role: 'member',
      memberId: memberId || null,
      isActive: true
    };

    const newUser = await User.create(userData);
    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.toSafeJSON()
    });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/logout', (req, res) => {
  // In a real application, you might want to blacklist the token
  res.json({ message: 'Logout successful' });
});

// Gallery endpoint
app.get('/gallery', async (req, res) => {
  try {
    const { category, featured, search, member, page, itemsPerPage } = req.query;
    const filters = { category, featured, search, member, page, itemsPerPage };
    
    const images = await GalleryImage.findAll(filters);
    res.json(images.map(image => image.toJSON()));
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

// Gallery categories endpoint
app.get('/gallery/categories', async (req, res) => {
  try {
    const categories = await GalleryImage.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Meet the Souls endpoint
app.get('/meetthesouls', async (req, res) => {
  try {
    const { rank, chapter, search } = req.query;
    const filters = { rank, chapter, search };
    
    const members = await Member.findAll(filters);
    res.json(members.map(member => member.toJSON()));
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Members ranks endpoint
app.get('/meetthesouls/ranks', async (req, res) => {
  try {
    const ranks = await Member.getRanks();
    res.json(ranks);
  } catch (error) {
    console.error('Error fetching ranks:', error);
    res.status(500).json({ error: 'Failed to fetch ranks' });
  }
});

// Members chapters endpoint
app.get('/meetthesouls/chapters', async (req, res) => {
  try {
    const chapters = await Member.getChapters();
    res.json(chapters);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

// Admin routes - require authentication and admin role
app.use('/admin', authenticateToken, requireAdmin);

// Admin Gallery Management
app.get('/admin/gallery', async (req, res) => {
  try {
    const images = await GalleryImage.findAll();
    res.json(images.map(image => image.toJSON()));
  } catch (error) {
    console.error('Error fetching admin gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

app.post('/admin/gallery', async (req, res) => {
  try {
    const { title, category, description, imageUrl, tags, featured, location, members, date } = req.body;
    
    if (!title || !category || !description || !imageUrl) {
      return res.status(400).json({ error: 'Title, category, description, and imageUrl are required' });
    }

    const newImage = await GalleryImage.create({ 
      title, category, description, imageUrl, tags, featured, location, members, date 
    });
    res.status(201).json(newImage.toJSON());
  } catch (error) {
    console.error('Error creating gallery image:', error);
    res.status(500).json({ error: 'Failed to create image' });
  }
});

app.put('/admin/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const image = await GalleryImage.findById(id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const updatedImage = await image.update(updateData);
    res.json(updatedImage.toJSON());
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({ error: 'Failed to update image' });
  }
});

app.delete('/admin/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const image = await GalleryImage.findById(id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    await image.delete();
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Admin Member Management
app.get('/admin/members', async (req, res) => {
  try {
    const members = await Member.findAll();
    res.json(members.map(member => member.toJSON()));
  } catch (error) {
    console.error('Error fetching admin members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

app.post('/admin/members', async (req, res) => {
  try {
    const { name, roadname, rank, chapter, bio, image } = req.body;
    
    if (!name || !rank || !chapter || !bio) {
      return res.status(400).json({ error: 'Name, rank, chapter, and bio are required' });
    }

    const newMember = await Member.create({ name, roadname, rank, chapter, bio, image });
    res.status(201).json(newMember.toJSON());
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: 'Failed to create member' });
  }
});

app.put('/admin/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const updatedMember = await member.update(updateData);
    res.json(updatedMember.toJSON());
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

app.delete('/admin/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    await member.delete();
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

// Admin User Management
app.get('/admin/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users.map(user => user.toSafeJSON()));
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/admin/users', async (req, res) => {
  try {
    const { username, email, password, role, memberId } = req.body;
    
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Username, email, password, and role are required' });
    }

    const newUser = await User.create({ username, email, password, role, memberId });
    res.status(201).json({
      message: 'User created successfully',
      user: newUser.toSafeJSON()
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await user.update(updateData);
    res.json({
      message: 'User updated successfully',
      user: updatedUser.toSafeJSON()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.delete();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((error, req, res) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Unholy Souls MC Backend server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Available endpoints:`);
  console.log(`   - POST /login`);
  console.log(`   - POST /register`);
  console.log(`   - POST /logout`);
  console.log(`   - GET /gallery`);
  console.log(`   - GET /gallery/categories`);
  console.log(`   - GET /meetthesouls`);
  console.log(`   - GET /meetthesouls/ranks`);
  console.log(`   - GET /meetthesouls/chapters`);
  console.log(`🔐 Admin endpoints (require auth + admin role):`);
  console.log(`   - GET /admin/gallery`);
  console.log(`   - POST /admin/gallery`);
  console.log(`   - PUT /admin/gallery/:id`);
  console.log(`   - DELETE /admin/gallery/:id`);
  console.log(`   - GET /admin/members`);
  console.log(`   - POST /admin/members`);
  console.log(`   - PUT /admin/members/:id`);
  console.log(`   - DELETE /admin/members/:id`);
  console.log(`   - GET /admin/users`);
  console.log(`   - POST /admin/users`);
  console.log(`   - PUT /admin/users/:id`);
  console.log(`   - DELETE /admin/users/:id`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
