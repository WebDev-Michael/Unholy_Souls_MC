#!/bin/bash

# Render.com Deployment Script for Unholy Souls MC Backend
# This script runs during the build process on Render.com

echo "🚀 Starting deployment process..."

# Check if we're in production mode
if [ "$NODE_ENV" = "production" ]; then
    echo "📦 Production environment detected"
    
    # Install dependencies
    echo "📥 Installing dependencies..."
    npm install
    
    # Wait for database to be ready (Render.com specific)
    echo "⏳ Waiting for database connection..."
    sleep 10
    
    # Run database migrations
    echo "🗄️ Running database migrations..."
    npm run migrate
    
    # Check if migrations were successful
    if [ $? -eq 0 ]; then
        echo "✅ Database migrations completed successfully"
        
        # Run seed data (optional - comment out if you don't want to seed production)
        echo "🌱 Running seed data..."
        npm run seed
        
        if [ $? -eq 0 ]; then
            echo "✅ Seed data completed successfully"
        else
            echo "⚠️ Seed data failed, but continuing deployment"
        fi
    else
        echo "❌ Database migrations failed"
        exit 1
    fi
    
    echo "🎉 Deployment completed successfully!"
else
    echo "🔧 Development environment detected"
    echo "📥 Installing dependencies..."
    npm install
    echo "✅ Development setup completed"
fi
