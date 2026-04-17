# 📚 Service Portal API Documentation

## 🔧 **Setup Instructions**

### **Port Configuration**
- **Port**: 1811 (Student ID last 4 digits)
- **Base URL**: `http://localhost:1811/api`

### **Database Connection**
- **MongoDB Atlas**: Connected
- **Database**: service-portal
- **Collections**: users, services, complaints, documents, recommendations

---

## 🎯 **Feature 1: Service Management APIs**

### **1. Get All Available Services**
```http
GET /api/services
```

**Headers:**
```
Content-Type: application/json
```

**Response:**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "Service 1",
  "description": "This is the first service available for users",
  "category": "General",
  "prerequisites": ["Basic Training", "ID Verification"],
  "documentsRequired": ["ID Proof", "Address Proof"],
  "savedBy": ["60f7b3b3b3b3b3b3b3b3b3b4"],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### **2. Get User's Saved Services**
```http
GET /api/services/saved/:userId
```

**Headers:**
```
Content-Type: application/json
```

**Parameters:**
- `userId` (path parameter): User ID

**Response:**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Service 1",
    "description": "This is the first service available for users",
    "category": "General",
    "prerequisites": ["Basic Training", "ID Verification"],
    "documentsRequired": ["ID Proof", "Address Proof"]
  }
]
```

---

### **3. Save a Service for User**
```http
POST /api/services/save
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "60f7b3b3b3b3b3b3b3b3b3b4",
  "serviceId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

**Response:**
```json
{
  "message": "Service saved successfully"
}
```

---

### **4. Remove a Saved Service**
```http
DELETE /api/services/remove
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "60f7b3b3b3b3b3b3b3b3b3b4",
  "serviceId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

**Response:**
```json
{
  "message": "Service removed successfully"
}
```

---

### **5. Get Missing Prerequisites Warnings**
```http
GET /api/services/warnings/:userId
```

**Headers:**
```
Content-Type: application/json
```

**Parameters:**
- `userId` (path parameter): User ID

**Response:**
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

## 📝 **Feature 2: Complaint Management APIs**

### **1. Get User's Complaints**
```http
GET /api/complaints/user/:userId
```

**Headers:**
```
Content-Type: application/json
```

**Parameters:**
- `userId` (path parameter): User ID

**Response:**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
    "user": "60f7b3b3b3b3b3b3b3b3b3b4",
    "subject": "Complaint History 1",
    "description": "This is the first complaint from the user",
    "status": "Demoted",
    "priority": "Medium",
    "createdAt": "2026-01-03T00:00:00.000Z",
    "updatedAt": "2026-01-03T00:00:00.000Z"
  }
]
```

---

### **2. Submit New Complaint**
```http
POST /api/complaints
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "user": "60f7b3b3b3b3b3b3b3b3b3b4",
  "subject": "New Service Issue",
  "description": "I'm experiencing issues with the service functionality",
  "priority": "High"
}
```

**Response:**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b6",
  "user": "60f7b3b3b3b3b3b3b3b3b3b4",
  "subject": "New Service Issue",
  "description": "I'm experiencing issues with the service functionality",
  "status": "Pending",
  "priority": "High",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

### **3. Update Complaint Status**
```http
PATCH /api/complaints/:id
```

**Headers:**
```
Content-Type: application/json
```

**Parameters:**
- `id` (path parameter): Complaint ID

**Body:**
```json
{
  "status": "In Progress",
  "priority": "Medium"
}
```

**Response:**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
  "user": "60f7b3b3b3b3b3b3b3b3b3b4",
  "subject": "Complaint History 1",
  "description": "This is the first complaint from the user",
  "status": "In Progress",
  "priority": "Medium",
  "createdAt": "2026-01-03T00:00:00.000Z",
  "updatedAt": "2024-01-15T11:05:00.000Z"
}
```

---

### **4. Delete Complaint**
```http
DELETE /api/complaints/:id
```

**Headers:**
```
Content-Type: application/json
```

**Parameters:**
- `id` (path parameter): Complaint ID

**Response:**
```json
{
  "message": "Complaint deleted successfully"
}
```

---

## 🔧 **Postman Testing Guide**

### **Setup Instructions**
1. **Import Collection**: Use the provided Postman collection
2. **Environment Variables**: Set base URL and user ID
3. **Authentication**: No auth required for demo (JWT implemented)

### **Test Data**
- **Sample User ID**: `60f7b3b3b3b3b3b3b3b3b3b4`
- **Sample Service ID**: `60f7b3b3b3b3b3b3b3b3b3b3`
- **Sample Complaint ID**: `60f7b3b3b3b3b3b3b3b3b3b5`

### **Expected Results**
- All GET requests should return data after running `npm run seed`
- POST requests should create new records
- PATCH/DELETE requests should modify/remove records

---

## 🚀 **Server Setup**

### **Start Server**
```bash
# Update port in .env file
PORT=[YOUR_STUDENT_ID_LAST_4_DIGITS]

# Start server
npm start
```

### **Database Connection**
- MongoDB Atlas connection configured
- Sample data available with `npm run seed`
- All endpoints connected to database

---

## 📊 **API Summary**

| Feature | Endpoints | Methods | Database Connected |
|---------|-----------|---------|-------------------|
| Service Management | 5 endpoints | GET, POST, DELETE | ✅ Yes |
| Complaint Management | 4 endpoints | GET, POST, PATCH, DELETE | ✅ Yes |
| **Total** | **9 endpoints** | **4 methods** | **✅ All Connected** |

---

## 🎯 **Submission Requirements Met**

✅ **REST APIs developed** for 2 features  
✅ **Database connected** (MongoDB Atlas)  
✅ **Endpoint URLs documented**  
✅ **HTTP methods specified**  
✅ **Headers documented**  
✅ **Body/Parameters documented**  
✅ **Code snippets provided**  
✅ **Backend server on specific port**  
✅ **Ready for Postman testing**
