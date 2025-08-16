# 🚀 Render Deployment Guide for Unholy Souls MC Backend

## 📋 Prerequisites

- GitHub repository with your backend code
- Render.com account
- PostgreSQL database (Render provides this)

## 🔧 Environment Variables

Set these in your Render backend service environment variables:

### Required Variables
```
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-here
DATABASE_URL=postgresql://username:password@host:port/database
```

### Optional Variables
```
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=1000
FRONTEND_URL=https://your-frontend-url.onrender.com
```

## 🗄️ Database Setup

The backend automatically handles database setup during deployment:

1. **Automatic Migration**: Database schema is synced on startup
2. **Automatic Seeding**: Initial data is created if the database is empty
3. **Retry Logic**: Server will retry database connection up to 5 times

## 📦 Deployment Scripts

### Available Scripts

- `npm run render:deploy` - Full deployment with database setup
- `npm run render:build` - Build and database setup only
- `npm run db:setup` - Database migration and seeding
- `npm run db:migrate` - Database schema sync only
- `npm run db:seed` - Seed data only

### Render Build Command

In your Render service settings, use:
```
npm run render:build
```

### Render Start Command

In your Render service settings, use:
```
npm start
```

## 🔄 Deployment Process

1. **Build Phase**: 
   - Installs dependencies
   - Runs database setup (migration + seeding)

2. **Start Phase**:
   - Connects to database
   - Starts Express server
   - Health check available at `/health`

## 🚨 Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Check your `DATABASE_URL` environment variable
2. Ensure PostgreSQL service is running
3. Check firewall/network settings
4. Verify database credentials

### Rate Limiting Issues

If you see 429 errors:

1. Check `RATE_LIMIT_MAX` environment variable
2. Monitor logs for rate limit violations
3. Consider increasing limits for production

### CORS Issues

If you see CORS errors:

1. Set `FRONTEND_URL` environment variable
2. Check that your frontend URL is in the allowed origins
3. Verify the frontend is making requests to the correct backend URL

## 📊 Monitoring

### Health Check Endpoint

```
GET /health
```

Returns:
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

### Logs

Check Render logs for:
- Database connection status
- API request logs
- Rate limiting violations
- Error details

## 🔐 Security Notes

1. **JWT Secret**: Use a strong, unique JWT secret
2. **Database URL**: Keep your database credentials secure
3. **Rate Limiting**: Adjust limits based on your traffic needs
4. **CORS**: Only allow necessary origins

## 📝 Initial Admin User

After first deployment, a default admin user is created:

- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `admin`

⚠️ **IMPORTANT**: Change this password immediately after first login!

## 🎯 Next Steps

1. Deploy to Render
2. Test all endpoints
3. Change default admin password
4. Add your real data
5. Monitor logs and performance

## 🆘 Support

If you encounter issues:

1. Check Render logs
2. Verify environment variables
3. Test database connection
4. Check the `/health` endpoint
5. Review this documentation
