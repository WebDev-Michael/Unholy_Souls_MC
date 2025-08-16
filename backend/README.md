# Unholy Souls MC - Backend API

This is the backend API server for the Unholy Souls MC website, providing server-side functionality for the gaming community platform.

## 🚀 Features

- **RESTful API** - Clean and organized API endpoints
- **Security** - Built-in security middleware (helmet, CORS, rate limiting)
- **Logging** - Request logging with Morgan
- **Environment Configuration** - Secure environment variable management
- **Development Tools** - Hot reloading with Nodemon

## 📋 Prerequisites

- Node.js (version 18.0.0 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in the `.env` file:
   ```env
   PORT=5000
   NODE_ENV=development
   ```

## 🚀 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Running Tests
```bash
npm test
```

## 🌐 API Endpoints

The backend provides the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify authentication token

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Gallery
- `GET /api/gallery` - Get all images
- `POST /api/gallery` - Upload new image
- `DELETE /api/gallery/:id` - Delete image

### Admin
- `GET /api/admin/dashboard` - Admin dashboard data
- `POST /api/admin/members` - Admin member management

## 📁 Project Structure

```
backend/
├── server.js          # Main server file
├── routes/            # API route handlers
├── middleware/        # Custom middleware
├── controllers/       # Business logic
├── models/           # Data models
├── config/           # Configuration files
├── utils/            # Utility functions
└── tests/            # Test files
```

## 🔧 Configuration

The server can be configured through environment variables:

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)
- `CORS_ORIGIN` - Allowed CORS origins
- `RATE_LIMIT_WINDOW` - Rate limiting window in milliseconds
- `RATE_LIMIT_MAX` - Maximum requests per window

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

## 📦 Dependencies

### Production Dependencies
- **express** - Web framework for Node.js
- **cors** - Cross-Origin Resource Sharing middleware
- **dotenv** - Environment variable loader
- **helmet** - Security middleware
- **morgan** - HTTP request logger
- **express-rate-limit** - Rate limiting middleware

### Development Dependencies
- **nodemon** - Development server with auto-reload
- **jest** - Testing framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Unholy Souls MC** - Building the ultimate Minecraft community experience! 🎮
