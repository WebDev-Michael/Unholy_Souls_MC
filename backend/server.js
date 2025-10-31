import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { sequelize, Member, GalleryImage, User } from './models/index.js';
import './config/cloudinary.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Render deployment (fixes X-Forwarded-For header issues)
app.set('trust proxy', 1);

// Security middleware - configure Helmet to not interfere with CORS
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOrigins = [
  'http://localhost:5173', // Vite default port
  'http://localhost:5174', // Current frontend port
  'http://localhost:5175', // Alternative Vite port
  'http://localhost:3000', // Alternative React port
  'http://localhost:5176', // Additional Vite port
  'http://localhost:5177', // Additional Vite port
  'https://unholy-souls-mc-frontend.onrender.com' // Render frontend
];

// Add custom frontend URL from environment variables (check both common names)
if (process.env.FRONTEND_URL) {
  corsOrigins.push(process.env.FRONTEND_URL);
}
if (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== 'https://your-frontend-domain.onrender.com') {
  corsOrigins.push(process.env.CORS_ORIGIN);
}

// In development, allow all localhost origins to prevent CORS issues
const isDevelopment = process.env.NODE_ENV !== 'production';
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // In development, allow all localhost origins
    if (isDevelopment && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    // Also allow any *.onrender.com subdomain in case of custom domains
    const isAllowed = corsOrigins.includes(origin) || 
                     (origin.includes('.onrender.com') && origin.startsWith('https://'));
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      console.log('❌ Allowed origins:', corsOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

console.log('🔍 CORS Origins:', corsOrigins);
console.log('🔍 CORS Development Mode:', isDevelopment);

app.use(cors(corsOptions));

// Rate limiting - More permissive for public endpoints, stricter for admin/auth
const publicLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 1000, // 1000 requests per 15 minutes for public endpoints
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Better IP detection for proxy environments
  keyGenerator: (req) => {
    // Use X-Forwarded-For header if available, fallback to req.ip
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
  },
  handler: (req, res) => {
    res.status(429).json({ 
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW) / 1000 / 60) || 15
    });
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Better IP detection for proxy environments
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
  }
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per 15 minutes for admin endpoints
  message: 'Too many admin requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Better IP detection for proxy environments
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
  }
});

// Very permissive rate limiter for frequently accessed public endpoints
const frequentAccessLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // 5000 requests per 15 minutes for frequently accessed endpoints
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Better IP detection for proxy environments
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
  }
});

// Apply rate limiting selectively
app.use('/login', authLimiter); // Stricter for authentication
app.use('/register', authLimiter); // Stricter for registration
app.use('/admin', adminLimiter); // Moderate for admin endpoints
app.use('/meetthesouls', frequentAccessLimiter); // Very permissive for member data
app.use('/gallery', frequentAccessLimiter); // Very permissive for gallery data
app.use('/', publicLimiter); // More permissive for other public endpoints

// Logging middleware
app.use(morgan('combined'));

// Request logging for debugging
app.use((req, res, next) => {
  const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
  console.log(`📡 ${req.method} ${req.path} - IP: ${clientIP} - User-Agent: ${req.get('User-Agent')?.substring(0, 50)}...`);
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    console.log('🔍 File filter - mimetype:', file.mimetype);
    if (file.mimetype.startsWith('image/')) {
      console.log('✅ File accepted by filter');
      cb(null, true);
    } else {
      console.log('❌ File rejected by filter - not an image');
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Simple authentication middleware
const authenticateToken = (req, res, next) => {
  console.log('🔐 authenticateToken middleware called for:', req.path);
  console.log('🔐 Headers:', req.headers);
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    console.log('🔐 Token found, verifying...');
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret);
    console.log('✅ Token verified, user:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Admin role check middleware
const requireAdmin = (req, res, next) => {
  console.log('👑 requireAdmin middleware called');
  console.log('👑 User:', req.user);
  
  if (req.user.role !== 'admin') {
    console.log('❌ User is not admin, role:', req.user.role);
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  console.log('✅ User is admin, proceeding...');
  next();
};

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connectivity
    let dbStatus = 'unknown';
    try {
      await sequelize.authenticate();
      dbStatus = 'connected';
    } catch {
      dbStatus = 'disconnected';
    }

    res.status(200).json({ 
      status: 'OK', 
      message: 'Unholy Souls MC Backend is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus,
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Health check failed',
      error: error.message 
    });
  }
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
    console.log('🔍 GET /gallery - Request received');
    console.log('🔍 Query params:', req.query);
    
    const { category, featured, search, page, itemsPerPage } = req.query;
    
    // Build where clause
    const where = {};
    if (category && category !== 'all') {
      where.category = category;
    }
    if (featured !== undefined) {
      where.featured = featured === 'true';
    }
    if (search) {
      const searchTerm = search.toLowerCase();
      where[sequelize.Op.or] = [
        { title: { [sequelize.Op.like]: `%${searchTerm}%` } },
        { description: { [sequelize.Op.like]: `%${searchTerm}%` } },
        { location: { [sequelize.Op.like]: `%${searchTerm}%` } }
      ];
    }
    
    const options = {
      where,
      order: [['date', 'DESC']]
    };
    
    // Add pagination if provided
    if (page && itemsPerPage) {
      const offset = (parseInt(page) - 1) * parseInt(itemsPerPage);
      options.limit = parseInt(itemsPerPage);
      options.offset = offset;
    }
    
    console.log('🔍 Calling GalleryImage.findAll with options:', options);
    
    const images = await GalleryImage.findAll(options);
    console.log('✅ Gallery images fetched successfully, count:', images.length);
    
    res.json(images.map(image => image.toJSON()));
  } catch (error) {
    console.error('❌ Error fetching gallery images:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

// Gallery categories endpoint
app.get('/gallery/categories', async (req, res) => {
  try {
    console.log('🔍 GET /gallery/categories - Request received');
    
    const categories = await GalleryImage.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: 'category',
      order: [['category', 'ASC']]
    });
    
    console.log('✅ Gallery categories fetched successfully:', categories);
    
    res.json(categories);
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Cloudinary upload endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    console.log('🔍 POST /upload - Request received');
    console.log('🔍 Headers:', req.headers);
    console.log('🔍 File:', req.file);
    console.log('🔍 Cloudinary config check:');
    console.log('  - Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing');
    console.log('  - API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing');
    console.log('  - API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing');
    
    if (!req.file) {
      console.log('❌ No file provided in request');
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('🔍 File details:', {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer ? req.file.buffer.length : 'No buffer'
    });

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      console.log('🔍 Starting Cloudinary upload...');
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'unholy-souls-mc', // Optional: organize images in a folder
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            console.error('❌ Error details:', error.message);
            console.error('❌ Error status:', error.http_code);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload successful:', result);
            resolve(result);
          }
        }
      ).end(req.file.buffer);
    });

    console.log('✅ Upload completed, sending response');
    res.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    });
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error.message 
    });
  }
});

// Meet the Souls endpoint
app.get('/meetthesouls', async (req, res) => {
  try {
    const { rank, chapter, search } = req.query;
    
    // Build where clause
    const where = {};
    if (rank && rank !== 'all') {
      where.rank = rank;
    }
    if (chapter && chapter !== 'all') {
      where.chapter = chapter;
    }
    if (search) {
      where[sequelize.Op.or] = [
        { name: { [sequelize.Op.like]: `%${search}%` } },
        { roadname: { [sequelize.Op.like]: `%${search}%` } },
        { bio: { [sequelize.Op.like]: `%${search}%` } }
      ];
    }
    
    const options = {
      where,
      order: [['name', 'ASC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'role', 'isActive']
      }]
    };
    
    const members = await Member.findAll(options);
    res.json(members.map(member => member.toJSON()));
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Members ranks endpoint
app.get('/meetthesouls/ranks', async (req, res) => {
  try {
    const ranks = await Member.findAll({
      attributes: [
        'rank',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { isActive: true },
      group: 'rank',
      order: [['rank', 'ASC']]
    });
    res.json(ranks);
  } catch (error) {
    console.error('Error fetching ranks:', error);
    res.status(500).json({ error: 'Failed to fetch ranks' });
  }
});

// Members chapters endpoint
app.get('/meetthesouls/chapters', async (req, res) => {
  try {
    const chapters = await Member.findAll({
      attributes: [
        'chapter',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { isActive: true },
      group: 'chapter',
      order: [['chapter', 'ASC']]
    });
    res.json(chapters);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

// Admin routes - require authentication and admin role
app.use('/admin', (req, res, next) => {
  console.log('🚦 Admin middleware triggered for:', req.method, req.path);
  console.log('🚦 Request headers:', req.headers);
  console.log('🚦 Request body:', req.body);
  next();
}, authenticateToken, requireAdmin);

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
    console.log('🔍 POST /admin/gallery - Request received');
    console.log('🔍 Headers:', req.headers);
    console.log('🔍 Body:', req.body);
    console.log('🔍 User:', req.user);
    
    const { title, category, description, imageUrl, tags, featured, location, members, date } = req.body;
    
    console.log('🔍 Extracted data:', { title, category, description, imageUrl, tags, featured, location, members, date });
    
    if (!title || !category || !description || !imageUrl) {
      console.log('❌ Validation failed - missing required fields');
      console.log('❌ Required: title, category, description, imageUrl');
      console.log('❌ Received:', { title: !!title, category: !!category, description: !!description, imageUrl: !!imageUrl });
      return res.status(400).json({ error: 'Title, category, description, and imageUrl are required' });
    }

    // Validate that imageUrl is a proper URL
    try {
      new URL(imageUrl);
    } catch {
      console.log('❌ Invalid imageUrl format:', imageUrl);
      return res.status(400).json({ error: 'Invalid imageUrl format. Must be a valid URL.' });
    }

    console.log('✅ Validation passed, creating gallery image...');
    
    const newImage = await GalleryImage.create({ 
      title, category, description, imageUrl, tags, featured, location, members, date 
    });
    
    console.log('✅ Gallery image created successfully:', newImage.toJSON());
    res.status(201).json(newImage.toJSON());
  } catch (error) {
    console.error('❌ Error creating gallery image:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to create image' });
  }
});

app.put('/admin/gallery/:id', async (req, res) => {
  try {
    console.log('🔍 PUT /admin/gallery/:id - Request received');
    console.log('🔍 URL params:', req.params);
    console.log('🔍 Request body:', req.body);
    console.log('🔍 User:', req.user);
    
    const { id } = req.params;
    const { title, category, description, imageUrl, tags, featured, location, members, date } = req.body;
    
    console.log('🔍 Looking for image with ID:', id);
    console.log('🔍 Update data:', { title, category, description, imageUrl, tags, featured, location, members, date });

    // Validate required fields
    if (!title || !category || !description || !imageUrl) {
      console.log('❌ Validation failed - missing required fields');
      console.log('❌ Required: title, category, description, imageUrl');
      console.log('❌ Received:', { title: !!title, category: !!category, description: !!description, imageUrl: !!imageUrl });
      return res.status(400).json({ error: 'Title, category, description, and imageUrl are required' });
    }

    // Validate that imageUrl is a proper URL
    try {
      new URL(imageUrl);
    } catch {
      console.log('❌ Invalid imageUrl format:', imageUrl);
      return res.status(400).json({ error: 'Invalid imageUrl format. Must be a valid URL.' });
    }

    const image = await GalleryImage.findByPk(id);
    if (!image) {
      console.log('❌ Image not found with ID:', id);
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // Safety check: ensure image is a proper Sequelize model instance
    if (typeof image.toJSON !== 'function') {
      console.log('❌ Image object is not a proper Sequelize model instance:', typeof image, image);
      console.log('❌ Image object keys:', Object.keys(image || {}));
      return res.status(500).json({ error: 'Invalid image data structure' });
    }
    
    console.log('✅ Image found:', image.toJSON());
    console.log('✅ Updating image...');

    const updatedImage = await image.update({
      title,
      category,
      description,
      imageUrl,
      tags: tags || [],
      featured: featured || false,
      location: location || null,
      members: members || [],
      date: date || new Date()
    });
    
    // Safety check: ensure updatedImage is also a proper Sequelize model instance
    if (typeof updatedImage.toJSON !== 'function') {
      console.log('❌ Updated image object is not a proper Sequelize model instance:', typeof updatedImage, updatedImage);
      return res.status(500).json({ error: 'Failed to update image - invalid response structure' });
    }
    
    console.log('✅ Image updated successfully:', updatedImage.toJSON());
    res.json(updatedImage.toJSON());
  } catch (error) {
    console.error('❌ Error updating gallery image:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to update image' });
  }
});

app.delete('/admin/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const image = await GalleryImage.findByPk(id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    await image.destroy();
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Admin Member Management
app.get('/admin/members', async (req, res) => {
  try {
    const members = await Member.findAll({
      order: [['name', 'ASC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'role', 'isActive']
      }]
    });
    res.json(members.map(member => member.toJSON()));
  } catch (error) {
    console.error('Error fetching admin members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

app.post('/admin/members', async (req, res) => {
  try {
    console.log('🔍 POST /admin/members - Request received');
    console.log('🔍 Headers:', req.headers);
    console.log('🔍 Body:', req.body);
    console.log('🔍 User:', req.user);
    
    const { name, roadname, rank, chapter, bio, image } = req.body;
    
    if (!name || !rank || !chapter || !bio) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({ error: 'Name, rank, chapter, and bio are required' });
    }

    console.log('✅ Validation passed, creating member...');
    const newMember = await Member.create({ name, roadname, rank, chapter, bio, image });
    console.log('✅ Member created successfully:', newMember.toJSON());
    
    res.status(201).json(newMember.toJSON());
  } catch (error) {
    console.error('❌ Error creating member:', error);
    res.status(500).json({ error: 'Failed to create member' });
  }
});

app.put('/admin/members/:id', async (req, res) => {
  try {
    console.log('🔍 PUT /admin/members/:id - Request received');
    console.log('🔍 URL params:', req.params);
    console.log('🔍 Request body:', req.body);
    console.log('🔍 User:', req.user);
    
    const { id } = req.params;
    const updateData = req.body;
    
    console.log('🔍 Looking for member with ID:', id);
    console.log('🔍 Update data:', updateData);

    const member = await Member.findByPk(id);
    if (!member) {
      console.log('❌ Member not found with ID:', id);
      return res.status(404).json({ error: 'Member not found' });
    }
    
    console.log('✅ Member found:', member.toJSON());
    console.log('✅ Updating member...');

    const updatedMember = await member.update(updateData);
    console.log('✅ Member updated successfully:', updatedMember.toJSON());
    
    res.json(updatedMember.toJSON());
  } catch (error) {
    console.error('❌ Error updating member:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

app.delete('/admin/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findByPk(id);
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    await member.destroy();
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
    res.json({
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

    const user = await User.findByPk(id);
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
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
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
const startServer = async () => {
  try {
    // Test database connection with retry logic for production
    let dbConnected = false;
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 5000; // 5 seconds

    while (!dbConnected && retryCount < maxRetries) {
      try {
        await sequelize.authenticate();
        console.log('✅ Database connection has been established successfully.');
        dbConnected = true;
      } catch (error) {
        retryCount++;
        console.log(`❌ Database connection attempt ${retryCount} failed:`, error.message);
        
        if (retryCount < maxRetries) {
          console.log(`🔄 Retrying in ${retryDelay/1000} seconds... (${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          console.log('❌ Max retries reached. Starting server without database sync.');
          break;
        }
      }
    }

    // Only sync database if we have a connection
    if (dbConnected) {
      try {
        await sequelize.sync({ force: false });
        console.log('✅ Database synchronized successfully.');
        
        // Try to seed initial data if tables are empty
        try {
          const seederModule = await import('./seeders/001_initial_data.js');
          const seedDatabase = seederModule.up;
          
          const memberCount = await Member.count();
          const imageCount = await GalleryImage.count();
          const userCount = await User.count();
          
          if (memberCount === 0 || imageCount === 0 || userCount === 0) {
            console.log('🌱 Seeding initial data from seeders...');
            await seedDatabase();
            console.log('✅ Initial data seeded successfully');
          } else {
            console.log('ℹ️ Database already contains data, skipping seeding');
          }
          
        } catch (seedError) {
          console.log('⚠️ Database seeding failed, but continuing with server startup:', seedError.message);
        }
        
      } catch (syncError) {
        console.log('⚠️ Database sync failed, but continuing with server startup:', syncError.message);
      }
    } else {
      console.log('⚠️ Starting server without database connection. Some features may not work.');
    }
    
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
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

// Start the server
startServer();

export default app;
