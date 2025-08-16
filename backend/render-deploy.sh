#!/bin/bash

echo "🚀 Starting Render deployment for Unholy Souls MC Backend..."

# Set environment
export NODE_ENV=production

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Wait a moment for any background processes
sleep 2

# Setup database (migrate and seed)
echo "🗄️  Setting up database..."
npm run db:setup

# Check if database setup was successful
if [ $? -eq 0 ]; then
    echo "✅ Database setup completed successfully"
    
    # Start the server
    echo "🚀 Starting server..."
    npm start
else
    echo "❌ Database setup failed, but continuing with server startup..."
    echo "⚠️  Some features may not work properly"
    
    # Start the server anyway (it has retry logic)
    echo "🚀 Starting server with database retry logic..."
    npm start
fi
