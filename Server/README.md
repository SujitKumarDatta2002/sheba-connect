# Service Portal

A full-stack service portal application with MongoDB backend and React frontend that allows users to save services, view recommendations, submit complaints, upload documents, and monitor missing prerequisite warnings.

## Features

- **Service Management**: Save and remove services, view available services
- **Recommendations**: Personalized suggestions based on user profile
- **Complaint System**: Submit and track complaint history
- **Document Management**: Upload, download, and manage documents
- **Alerts & Warnings**: Monitor missing prerequisites and document requirements
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- Multer for file uploads
- CORS for cross-origin requests

### Frontend
- React.js
- CSS3 with modern styling
- Responsive design
- Component-based architecture

## Project Structure

```
service-portal/
├── models/                 # MongoDB schemas
│   ├── User.js
│   ├── Service.js
│   ├── Complaint.js
│   ├── Document.js
│   └── Recommendation.js
├── routes/                 # API routes
│   ├── users.js
│   ├── services.js
│   ├── complaints.js
│   ├── documents.js
│   └── recommendations.js
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Services.js
│   │   │   ├── Recommendations.js
│   │   │   ├── Complaints.js
│   │   │   └── Documents.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
├── uploads/               # File upload directory
├── server.js              # Express server
├── package.json           # Backend dependencies
├── .env                   # Environment variables
└── seedData.js           # Database seeding script
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (installed and running)
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/service-portal
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Database Setup

Make sure MongoDB is running, then seed the database with sample data:

```bash
node seedData.js
```

This will create sample data including:
- A demo user (ID will be displayed in console)
- Sample services
- Sample complaints
- Sample documents
- Sample recommendations

### 4. Start the Application

```bash
# Start the backend server
npm start

# In a separate terminal, start the frontend
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/profile/:userId` - Get user profile

### Services
- `GET /api/services` - Get all available services
- `GET /api/services/saved/:userId` - Get user's saved services
- `POST /api/services/save` - Save a service for user
- `DELETE /api/services/remove` - Remove a saved service
- `GET /api/services/warnings/:userId` - Get missing prerequisites warnings

### Complaints
- `GET /api/complaints/user/:userId` - Get user's complaints
- `POST /api/complaints` - Submit a new complaint
- `PATCH /api/complaints/:id` - Update complaint status
- `DELETE /api/complaints/:id` - Delete a complaint

### Documents
- `GET /api/documents/user/:userId` - Get user's documents
- `POST /api/documents/upload` - Upload a document
- `GET /api/documents/download/:id` - Download a document
- `DELETE /api/documents/:id` - Delete a document
- `GET /api/documents/service/:serviceName/:userId` - Get documents by service

### Recommendations
- `GET /api/recommendations/user/:userId` - Get user's recommendations
- `GET /api/recommendations/personalized/:userId` - Get personalized recommendations
- `POST /api/recommendations` - Create a recommendation
- `POST /api/recommendations/generate/:userId` - Generate sample recommendations

## Usage

1. **Dashboard**: View overview of saved services, complaints, documents, and recommendations
2. **My Services**: Browse and save services, view warnings about missing prerequisites
3. **Recommendations**: View personalized suggestions
4. **Complaints**: Submit new complaints and view complaint history
5. **Documents**: Upload, download, and manage documents

## File Upload Support

Supported file types:
- PDF (.pdf)
- Images (.jpg, .jpeg, .png, .gif)
- Documents (.doc, .docx, .txt)

Maximum file size: 5MB

## Authentication

The application uses JWT-based authentication. For demo purposes, a mock user ID is hardcoded in the frontend. In production, you should implement proper login/logout functionality.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
