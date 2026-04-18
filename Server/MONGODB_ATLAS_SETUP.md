# 🔗 MongoDB Atlas Connection Setup Guide

## ⚠️ Current Issue
Your MongoDB Atlas cluster is blocking the connection because your IP address is not whitelisted.

## 🛠️ Steps to Fix

### 1. **Access MongoDB Atlas**
- Go to: https://cloud.mongodb.com/
- Login to your account
- Navigate to your cluster (Cluster0)

### 2. **Network Access Setup**
- In the left sidebar, click **"Network Access"**
- Click **"Add IP Address"**
- Choose one of these options:

#### Option A: Allow Current IP (Recommended)
- Click **"Add Current IP Address"**
- This will automatically add your current IP
- Click **"Confirm"**

#### Option B: Allow All IPs (For Development)
- Click **"Allow Access from Anywhere"**
- Enter `0.0.0.0/0` in the IP field
- Click **"Confirm"**
- ⚠️ **Security Note**: Only use this for development!

### 3. **Database User Setup**
- Go to **"Database Access"** in the left sidebar
- Ensure user `ShebaConnect` exists with correct password
- If not, create a new user with:
  - **Username**: `ShebaConnect`
  - **Password**: Your actual database password
  - **Permissions**: Read and write to all databases

### 4. **Update Environment File**
Replace `<db_password>` in your `.env` file with your actual password:

```env
MONGODB_URI=mongodb+srv://ShebaConnect:YOUR_ACTUAL_PASSWORD@cluster0.mdqox0i.mongodb.net/?appName=Cluster0
```

### 5. **Test Connection**
After whitelisting your IP, run:
```bash
node test-api.js
```

## 🔍 Troubleshooting

### Still Getting Connection Errors?
1. **Check Password**: Ensure password is correct and URL-encoded
2. **Check Network**: Try a different network or VPN
3. **Check Atlas Status**: Verify MongoDB Atlas is operational
4. **Wait 2-3 Minutes**: IP whitelist changes take time to propagate

### Password Contains Special Characters?
If your password has special characters, URL-encode it:
- `@` becomes `%40`
- `:` becomes `%3A`
- `#` becomes `%23`
- `?` becomes `%3F`

Example:
```env
MONGODB_URI=mongodb+srv://ShebaConnect:my%40password123@cluster0.mdqox0i.mongodb.net/?appName=Cluster0
```

## ✅ Expected Success Message
Once connected, you should see:
```
✅ MongoDB connection successful
✅ Test user created successfully
✅ Test service created successfully
✅ Service-user relationship created successfully
✅ Test data cleaned up
🎉 All API tests passed!
```

## 🚀 Next Steps After Connection

Once your IP is whitelisted:
1. Update your `.env` file with the correct password
2. Run `node test-api.js` to verify connection
3. Run `node seedData.js` to populate your Atlas database
4. Start your application with `npm start`

## 📞 Need Help?
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- Network Access Guide: https://www.mongodb.com/docs/atlas/security-whitelist/
