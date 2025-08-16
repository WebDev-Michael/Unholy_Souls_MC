# Unholy Souls MC Backend

Backend API server for the Unholy Souls MC website.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Production
```bash
npm install
npm start
```

## 📦 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run db:setup` - Manual database setup (for development)
- `npm run db:migrate` - Database schema sync only
- `npm run db:seed` - Seed data only
- `npm run db:reset` - Reset database (sync + seed)
- `npm run db:start` - Database setup then start server
- `npm run render:deploy` - Full deployment for Render
- `npm run render:build` - Build for Render (database setup on startup)

## 🗄️ Database Setup

The backend automatically handles database setup during server startup:

1. **Automatic Migration**: Database schema is synced on startup
2. **Automatic Seeding**: Initial data is created from seeders if database is empty
3. **Retry Logic**: Server retries database connection up to 5 times
4. **Graceful Fallback**: Server starts even if database setup fails
5. **Seeder-Based**: Uses `./seeders/001_initial_data.js` for consistent initial data

## 🌐 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /gallery` - Get gallery images
- `GET /gallery/categories` - Get image categories
- `GET /meetthesouls` - Get members
- `GET /meetthesouls/ranks` - Get member ranks
- `GET /meetthesouls/chapters` - Get member chapters

### Authentication
- `POST /login` - User login
- `POST /register` - User registration
- `POST /logout` - User logout

### Admin Endpoints (require auth + admin role)
- `GET /admin/gallery` - Admin gallery management
- `POST /admin/gallery` - Create gallery image
- `PUT /admin/gallery/:id` - Update gallery image
- `DELETE /admin/gallery/:id` - Delete gallery image
- `GET /admin/members` - Admin member management
- `POST /admin/members` - Create member
- `PUT /admin/members/:id` - Update member
- `DELETE /admin/members/:id` - Delete member
- `GET /admin/users` - Admin user management
- `POST /admin/users` - Create user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user

## 🔧 Environment Variables

### Required
- `JWT_SECRET` - Secret for JWT token signing
- `DATABASE_URL` - PostgreSQL connection string (production)
- `NODE_ENV` - Environment (development/production)

### Optional
- `RATE_LIMIT_WINDOW` - Rate limiting window in milliseconds
- `RATE_LIMIT_MAX` - Maximum requests per window
- `FRONTEND_URL` - Frontend URL for CORS

## 🚀 Render Deployment

For detailed Render deployment instructions, see [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md).

### Quick Render Setup
1. Set environment variables in Render dashboard
2. Use build command: `npm run render:build`
3. Use start command: `npm start`

## 🔐 Default Admin User

After first deployment:
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `admin`

⚠️ **Change this password immediately after first login!**

## 📊 Health Check

Monitor your backend health at `/health`:

```json
{
  "status": "OK",
  "message": "Unholy Souls MC Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "database": "connected",
  "uptime": 123.456
}
```

## 🛠️ Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (production), SQLite (development)
- **ORM**: Sequelize
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

## 📝 License

MIT License - see LICENSE file for details.
