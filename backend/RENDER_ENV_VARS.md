# 🚀 Render Deployment Environment Variables

This document lists all the environment variables you need to set in your Render dashboard for the backend to work properly.

## 📋 Required Environment Variables

### **NODE_ENV**
```
NODE_ENV=production
```
**Purpose**: Sets the application to production mode
**Required**: Yes

### **Database Configuration (PostgreSQL)**

#### **DB_USER**
```
DB_USER=your_postgres_username
```
**Purpose**: PostgreSQL database username
**Required**: Yes (set automatically by Render when connecting PostgreSQL)

#### **DB_PASSWORD**
```
DB_PASSWORD=your_postgres_password
```
**Purpose**: PostgreSQL database password
**Required**: Yes (set automatically by Render when connecting PostgreSQL)

#### **DB_NAME**
```
DB_NAME=your_postgres_database_name
```
**Purpose**: PostgreSQL database name
**Required**: Yes (set automatically by Render when connecting PostgreSQL)

#### **DB_HOST**
```
DB_HOST=your_postgres_host
```
**Purpose**: PostgreSQL database host
**Required**: Yes (set automatically by Render when connecting PostgreSQL)

#### **DB_PORT**
```
DB_PORT=5432
```
**Purpose**: PostgreSQL database port
**Required**: Yes (default: 5432)

### **JWT_SECRET**
```
JWT_SECRET=your_super_secret_jwt_key_here
```
**Purpose**: Secret key for JWT token signing
**Required**: Yes
**Security**: Generate a strong random string

## 🔧 Optional Environment Variables

### **Rate Limiting**

#### **RATE_LIMIT_WINDOW**
```
RATE_LIMIT_WINDOW=900000
```
**Purpose**: Rate limit window in milliseconds (15 minutes)
**Default**: 900000 (15 minutes)

#### **RATE_LIMIT_MAX**
```
RATE_LIMIT_MAX=100
```
**Purpose**: Maximum requests per IP per window
**Default**: 100

### **CORS Configuration**

#### **FRONTEND_URL**
```
FRONTEND_URL=https://your-frontend-domain.onrender.com
```
**Purpose**: Frontend domain for CORS configuration
**Required**: No (but recommended for production)

### **Server Configuration**

#### **PORT**
```
PORT=5000
```
**Purpose**: Server port
**Note**: Render automatically sets this

#### **LOG_LEVEL**
```
LOG_LEVEL=combined
```
**Purpose**: Logging level
**Default**: combined

## 🛠️ How to Set These in Render

1. **Go to your Render dashboard**
2. **Select your backend service**
3. **Click on "Environment" tab**
4. **Add each variable** with the exact names above
5. **Set the values** according to your configuration

## 🔐 Generating a Secure JWT Secret

For production, generate a strong JWT secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64

# Using Python
python3 -c "import secrets; print(secrets.token_hex(64))"
```

## 📝 Example Complete Configuration

Here's what your environment variables should look like in Render:

```
NODE_ENV=production
DB_USER=unholy_souls_user
DB_PASSWORD=your_secure_password_here
DB_NAME=unholy_souls_db
DB_HOST=your-postgres-host.render.com
DB_PORT=5432
JWT_SECRET=your_generated_secret_here
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
FRONTEND_URL=https://your-frontend.onrender.com
LOG_LEVEL=combined
```

## ⚠️ Important Notes

1. **Never commit real secrets** to your repository
2. **Use different JWT secrets** for development and production
3. **Database credentials** are automatically set by Render when you connect a PostgreSQL database
4. **Restart your service** after adding environment variables
5. **Check the logs** to ensure all variables are loaded correctly

## 🔍 Verification

After setting the environment variables, check your service logs to ensure:

1. ✅ Database connection established
2. ✅ JWT secret loaded
3. ✅ Server started successfully
4. ✅ Health check endpoint responding

Your backend should now work properly on Render! 🎉
