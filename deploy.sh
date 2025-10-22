#!/bin/bash

echo "🚀 Deploying PRP Music Platform..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run setup

# Build backend
echo "🔨 Building backend..."
npm run backend:build

# Build frontend
echo "🔨 Building frontend..."
npm run build

echo "✅ Build completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your environment variables"
echo "2. Set up your database (Supabase)"
echo "3. Configure FedaPay"
echo "4. Deploy to your hosting platform"
echo ""
echo "🔗 Useful commands:"
echo "- Start development: npm run dev:all"
echo "- Run tests: npm run test:all"
echo "- Format code: npm run format"
echo "- Lint code: npm run lint"
