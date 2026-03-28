# 🚀 Quick Start Guide

## Prerequisites
1. **Node.js** (v14 or higher)
2. **MongoDB** (installed and running)

## Step 1: Setup MongoDB

### Option A: MongoDB Atlas (Cloud Database) ⭐
1. **Whitelist Your IP**:
   - Go to: https://cloud.mongodb.com/
   - Navigate to **Network Access** → **Add IP Address**
   - Click **"Add Current IP Address"** → **Confirm**

2. **Update Password**:
   - Replace `<db_password>` in `.env` with your actual database password
   - If password has special characters, URL-encode them

3. **Test Connection**:
   ```bash
   npm run test-atlas
   ```

### Option B: Local MongoDB
```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
net start MongoDB

# Or start manually
mongod
```

## Step 2: Setup Project
```bash
# Install all dependencies
npm run setup

# Seed the database with sample data
npm run seed
```

## Step 3: Start the Application

### Option A: Easy Start (Recommended)
```bash
# This will start both backend and frontend
npm run full-start
```

### Option B: Manual Start
```bash
# Terminal 1 - Start Backend
npm start

# Terminal 2 - Start Frontend  
npm run client
```

## Step 4: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🎯 What You'll See

The application includes sample data that matches the reference image:
- **Saved Services**: Service 1, Service A, Service B
- **Complaint History**: 3 complaints with IDs 2088, 1072, 2024
- **Documents**: Sample uploaded documents
- **Recommendations**: Personalized suggestions
- **Warnings**: Missing prerequisite alerts

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
pgrep -x "mongod"

# If not running, start it
mongod
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Reset Database
```bash
# Clear all data and reseed
node seedData.js
```

## 📱 Features to Test

1. **Dashboard**: View statistics and recent activity
2. **Services**: Save/remove services, view warnings
3. **Recommendations**: Browse personalized suggestions  
4. **Complaints**: Submit new complaints, view history
5. **Documents**: Upload/download files

## 🎨 UI Features
- Responsive design (works on mobile)
- Modern sidebar navigation
- Interactive service cards
- File upload with progress indicators
- Real-time status updates
- Professional styling matching your reference image

Enjoy your Service Portal! 🎉
