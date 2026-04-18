# 🔧 Database Connection Fix Guide

## ❌ **Current Problem**
- **Error**: `services.find() buffering timed out after 10000ms`
- **Cause**: MongoDB connection failing (either local or Atlas)
- **Status**: Server running but can't connect to database

## 🛠️ **Solutions**

### **Option 1: Use Local MongoDB (Recommended for Testing)**

**Step 1: Install MongoDB**
```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify it's running
pgrep -x "mongod"
```

**Step 2: Keep Current .env Configuration**
Your `.env` file is already configured for local MongoDB:
```env
PORT=1811
MONGODB_URI=mongodb://localhost:27017/service-portal
JWT_SECRET=your_jwt_secret_key_here
```

**Step 3: Seed Database**
```bash
npm run seed
```

### **Option 2: Fix MongoDB Atlas Connection**

**Step 1: Whitelist Your IP**
1. Go to: https://cloud.mongodb.com/
2. Network Access → Add IP Address
3. Click "Add Current IP Address"
4. Wait 2-3 minutes for propagation

**Step 2: Update .env for Atlas**
```env
PORT=1811
MONGODB_URI=mongodb+srv://ShebaConnect:ShebaConnect123@cluster0.mdqox0i.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret_key_here
```

**Step 3: Test Connection**
```bash
npm run test-atlas
```

### **Option 3: Use Mock Data (Immediate Fix)**

If you need to test APIs immediately, I can create a mock data version.

## 🧪 **Testing After Fix**

**Test Server Status:**
```bash
curl http://localhost:1811/api/services
```

**Expected Response (with database):**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3",
    "name": "Service 1",
    "description": "This is the first service available for users",
    "category": "General"
  }
]
```

## 🚀 **Quick Fix Steps**

1. **Install MongoDB locally** (easiest option)
2. **Start MongoDB service**
3. **Restart your server**: `npm start`
4. **Test in Postman**: `http://localhost:1811/api/services`

## 📋 **Current Server Status**
- ✅ **Server**: Running on port 1811
- ❌ **Database**: Not connected
- 🔄 **Action**: Need to start MongoDB or whitelist IP

Choose one of the solutions above to fix the database connection and eliminate the 500 error!
