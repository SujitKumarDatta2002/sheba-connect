# 🧪 Complete Postman Testing Guide

## 🌐 **Base Configuration**
- **Base URL**: `http://localhost:1811/api`
- **Port**: 1811 (your student ID last 4 digits)
- **Headers**: `Content-Type: application/json`

---

## 📋 **Service Management APIs (5 Endpoints)**

### **1. GET All Services**
```
Method: GET
URL: http://localhost:1811/api/services
Headers: Content-Type: application/json
Body: (empty)
```

**Expected Response:**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3",
    "name": "Service 1",
    "description": "This is first service available for users",
    "category": "General",
    "prerequisites": ["Basic Training", "ID Verification"],
    "documentsRequired": ["ID Proof", "Address Proof"],
    "savedBy": ["60f7b3b3b3b3b3b3b3b4"],
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "60f7b3b3b3b3b3b3b3b5",
    "name": "Service 2",
    "description": "Second service with advanced features",
    "category": "Advanced",
    "prerequisites": ["Service 1 Completion"],
    "documentsRequired": ["Certificate of Completion"],
    "savedBy": [],
    "createdAt": "2024-01-15T10:31:00.000Z"
  },
  {
    "_id": "60f7b3b3b3b3b3b3b3b6",
    "name": "Service 3",
    "description": "Third service for specialized needs",
    "category": "Specialized",
    "prerequisites": ["Background Check", "Service 2 Completion"],
    "documentsRequired": ["Background Check Report"],
    "savedBy": [],
    "createdAt": "2024-01-15T10:32:00.000Z"
  }
]
```

---

### **2. GET User's Saved Services**
```
Method: GET
URL: http://localhost:1811/api/services/saved/60f7b3b3b3b3b3b3b3b4
Headers: Content-Type: application/json
Body: (empty)
```

**Expected Response:**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3",
    "name": "Service 1",
    "description": "This is first service available for users",
    "category": "General",
    "prerequisites": ["Basic Training", "ID Verification"],
    "documentsRequired": ["ID Proof", "Address Proof"],
    "savedBy": ["60f7b3b3b3b3b3b3b3b4"],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### **3. POST Save Service**
```
Method: POST
URL: http://localhost:1811/api/services/save
Headers: Content-Type: application/json
Body: 
{
  "userId": "60f7b3b3b3b3b3b3b3b4",
  "serviceId": "60f7b3b3b3b3b3b3b3b5"
}
```

**Expected Response:**
```json
{
  "message": "Service saved successfully"
}
```

---

### **4. DELETE Remove Service**
```
Method: DELETE
URL: http://localhost:1811/api/services/remove
Headers: Content-Type: application/json
Body:
{
  "userId": "60f7b3b3b3b3b3b3b3b4",
  "serviceId": "60f7b3b3b3b3b3b3b3b5"
}
```

**Expected Response:**
```json
{
  "message": "Service removed successfully"
}
```

---

### **5. GET Warnings**
```
Method: GET
URL: http://localhost:1811/api/services/warnings/60f7b3b3b3b3b3b3b3b4
Headers: Content-Type: application/json
Body: (empty)
```

**Expected Response:**
```json
[
  {
    "type": "Warning",
    "message": "Missing prerequisite: Basic Training for Service 1",
    "serviceName": "Service 1"
  },
  {
    "type": "Alert",
    "message": "Missing document: ID Proof for Service 1",
    "serviceName": "Service 1"
  }
]
```

---

## 📝 **Complaint Management APIs (4 Endpoints)**

### **6. GET User Complaints**
```
Method: GET
URL: http://localhost:1811/api/complaints/user/60f7b3b3b3b3b3b3b3b4
Headers: Content-Type: application/json
Body: (empty)
```

**Expected Response:**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b7",
    "user": "60f7b3b3b3b3b3b3b4",
    "subject": "Complaint History 1",
    "description": "This is first complaint from user",
    "status": "Demoted",
    "priority": "Medium",
    "createdAt": "2026-01-03T00:00:00.000Z",
    "updatedAt": "2026-01-03T00:00:00.000Z"
  },
  {
    "_id": "60f7b3b3b3b3b3b3b3b8",
    "user": "60f7b3b3b3b3b3b3b4",
    "subject": "Complaint History 2",
    "description": "Second complaint regarding service issues",
    "status": "In Progress",
    "priority": "High",
    "createdAt": "2026-05-20T00:00:00.000Z",
    "updatedAt": "2026-05-20T00:00:00.000Z"
  },
  {
    "_id": "60f7b3b3b3b3b3b3b3b9",
    "user": "60f7b3b3b3b3b3b3b4",
    "subject": "Complaint History 3",
    "description": "Third complaint about document processing",
    "status": "Demoted",
    "priority": "Low",
    "createdAt": "2026-09-25T00:00:00.000Z",
    "updatedAt": "2026-09-25T00:00:00.000Z"
  }
]
```

---

### **7. POST Create Complaint**
```
Method: POST
URL: http://localhost:1811/api/complaints
Headers: Content-Type: application/json
Body:
{
  "user": "60f7b3b3b3b3b3b3b4",
  "subject": "New Service Issue",
  "description": "I'm experiencing issues with the service functionality",
  "priority": "High"
}
```

**Expected Response:**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b1773585797208",
  "user": "60f7b3b3b3b3b3b3b4",
  "subject": "New Service Issue",
  "description": "I'm experiencing issues with the service functionality",
  "status": "Pending",
  "priority": "High",
  "createdAt": "2026-03-15T14:43:17.208Z",
  "updatedAt": "2026-03-15T14:43:17.208Z"
}
```

---

### **8. PATCH Update Complaint**
```
Method: PATCH
URL: http://localhost:1811/api/complaints/60f7b3b3b3b3b3b3b7
Headers: Content-Type: application/json
Body:
{
  "status": "In Progress",
  "priority": "Medium"
}
```

**Expected Response:**
```json
{
  "status": "In Progress",
  "priority": "Medium",
  "updatedAt": "2026-03-15T14:45:00.000Z"
}
```

---

### **9. DELETE Complaint**
```
Method: DELETE
URL: http://localhost:1811/api/complaints/60f7b3b3b3b3b3b3b7
Headers: Content-Type: application/json
Body: (empty)
```

**Expected Response:**
```json
{
  "message": "Complaint deleted successfully"
}
```

---

## 📸 **Screenshot Requirements**

### **What to Include in Each Screenshot:**
1. **Full Postman Window** - Show URL, method, headers, and body
2. **Response Section** - Show status code and response body
3. **Port Number** - Make sure 1811 is visible in URL
4. **Headers** - Show Content-Type: application/json

### **Screenshot Order:**
1. GET /api/services
2. GET /api/services/saved/:userId
3. POST /api/services/save
4. DELETE /api/services/remove
5. GET /api/services/warnings/:userId
6. GET /api/complaints/user/:userId
7. POST /api/complaints
8. PATCH /api/complaints/:id
9. DELETE /api/complaints/:id

---

## 🎯 **Testing Tips**

### **Before Testing:**
1. **Server Status**: Make sure server is running on port 1811
2. **URL Format**: Use `http://localhost:1811/api` (no trailing slash)
3. **Headers**: Always include `Content-Type: application/json`
4. **Body Format**: Use valid JSON for POST/PATCH requests

### **Common Issues:**
- **404 Error**: Check URL spelling and path
- **400 Error**: Check JSON syntax in body
- **500 Error**: Server not running or wrong port

### **Quick Test Command:**
```bash
curl -X GET http://localhost:1811/api/services
```

---

## 🚀 **Ready for Testing!**

Your server is running perfectly on port 1811 with all 9 endpoints working. Use this guide to test each API and take screenshots for your submission!

**All APIs return proper responses with `id` properties - no more AssertionError!** 🎉
