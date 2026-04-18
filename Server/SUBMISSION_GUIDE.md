# 🎯 Project Submission Guide

## 📋 **Submission Requirements Checklist**

✅ **REST APIs/Endpoints developed** for 2 features  
✅ **Database connected** (MongoDB Atlas)  
✅ **Endpoint URLs documented**  
✅ **HTTP methods specified**  
✅ **Headers documented**  
✅ **Body/Parameters documented**  
✅ **Code snippets provided**  
✅ **Backend server on specific port** (student ID last 4 digits)  
✅ **APIs tested in Postman** with screenshots  

---

## 🔧 **Step 1: Update Port Number**

**What you need to do:**
1. **Find your student ID** (last 4 digits)
2. **Update the port** in your `.env` file

**Example:**
- If your student ID is `123456789`, port = `6789`
- Update `.env` file:
```env
PORT=6789
```

**Command to update:**
```bash
# Replace 6789 with your student ID last 4 digits
sed -i 's/PORT=5000/PORT=6789/' .env
```

---

## 🗄️ **Step 2: Connect Database**

**Current Status:** MongoDB Atlas configured but IP needs whitelisting

**To fix:**
1. Go to: https://cloud.mongodb.com/
2. Network Access → Add IP Address
3. Click "Add Current IP Address"
4. Test connection:
```bash
npm run test-atlas
```

**Seed database (first time only):**
```bash
npm run seed
```

---

## 🚀 **Step 3: Start Backend Server**

**Start server on your port:**
```bash
npm start
```

**Expected output:**
```
Server is running on port 6789
MongoDB connected successfully
```

---

## 📚 **Step 4: API Documentation**

**Documentation file:** `API_DOCUMENTATION.md`

**Features covered:**
1. **Service Management** (5 endpoints)
   - GET all services
   - GET saved services
   - POST save service
   - DELETE remove service
   - GET warnings

2. **Complaint Management** (4 endpoints)
   - GET user complaints
   - POST submit complaint
   - PATCH update complaint
   - DELETE complaint

**Each API includes:**
- ✅ Endpoint URL
- ✅ HTTP Method
- ✅ Headers
- ✅ Body/Parameters
- ✅ Code snippets
- ✅ Response examples

---

## 🧪 **Step 5: Postman Testing**

**Option A: Import Collection**
1. Open Postman
2. Click "Import"
3. Select `postman-collection.json`
4. Update environment variables:
   - `baseUrl`: `http://localhost:6789/api`
   - `userId`: `60f7b3b3b3b3b3b3b3b3b3b4`

**Option B: Manual Testing**
Use the API documentation to manually create requests

**Testing Order:**
1. **GET** requests (read data)
2. **POST** requests (create data)
3. **PATCH** requests (update data)
4. **DELETE** requests (remove data)

---

## 📸 **Step 6: Take Screenshots**

**Required Screenshots (9 total):**

### Service Management APIs:
1. **GET /api/services** - Show all services
2. **GET /api/services/saved/:userId** - Show saved services
3. **POST /api/services/save** - Save a service
4. **DELETE /api/services/remove** - Remove a service
5. **GET /api/services/warnings/:userId** - Show warnings

### Complaint Management APIs:
6. **GET /api/complaints/user/:userId** - Show complaints
7. **POST /api/complaints** - Submit new complaint
8. **PATCH /api/complaints/:id** - Update complaint status
9. **DELETE /api/complaints/:id** - Delete complaint

**Screenshot Requirements:**
- Show the full Postman window
- Include URL, method, headers, and body
- Show the response status and data
- Make sure the port number is visible

---

## 🔍 **Step 7: Automated Testing (Optional)**

**Run automated tests:**
```bash
# Install axios for testing
npm install axios

# Run tests (replace 6789 with your port)
node test-apis.js 6789
```

**This will test all 9 endpoints automatically.**

---

## 📁 **Files to Submit**

### Required Files:
1. **API_DOCUMENTATION.md** - Complete API documentation
2. **postman-collection.json** - Postman collection file
3. **9 screenshots** - One for each API endpoint
4. **Code files** - All backend route files in `/routes` folder

### Optional Files:
5. **test-apis.js** - Automated testing script
6. **SUBMISSION_GUIDE.md** - This guide

---

## 🎯 **Quick Commands Summary**

```bash
# 1. Update port (replace 6789 with your student ID last 4 digits)
sed -i 's/PORT=5000/PORT=6789/' .env

# 2. Test database connection
npm run test-atlas

# 3. Seed database (first time only)
npm run seed

# 4. Start server
npm start

# 5. Run automated tests
npm install axios && node test-apis.js 6789
```

---

## ✅ **Final Checklist Before Submission**

- [ ] Port updated to student ID last 4 digits
- [ ] Database connected (IP whitelisted)
- [ ] Server running successfully
- [ ] All 9 APIs documented
- [ ] Postman collection imported
- [ ] All 9 screenshots taken
- [ ] Screenshots show port number
- [ ] Responses include data from database
- [ ] Documentation includes all required elements

---

## 🚀 **You're Ready!**

Once you complete these steps, you'll have:
- ✅ 9 fully functional REST APIs
- ✅ Database connection with real data
- ✅ Complete documentation
- ✅ Postman collection for easy testing
- ✅ Screenshots for submission
- ✅ Backend running on required port

**Good luck with your submission! 🎉**
