#!/bin/bash

echo "🚀 Starting Service Portal Application..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "❌ MongoDB is not running. Please start MongoDB first:"
    echo "   macOS: brew services start mongodb-community"
    echo "   Ubuntu: sudo systemctl start mongod"
    echo "   Windows: net start MongoDB"
    echo ""
    echo "Or install MongoDB from: https://www.mongodb.com/try/download/community"
    exit 1
fi

echo "✅ MongoDB is running"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd client && npm install && cd ..
fi

# Seed the database
echo "🌱 Seeding database with sample data..."
node seedData.js

# Start the backend server
echo "🖥️  Starting backend server..."
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start the frontend
echo "🌐 Starting frontend..."
cd client
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 Application is starting!"
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend API: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID
