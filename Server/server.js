const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: false,
  tls: true,
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Import routes
const serviceRoutes = require('./routes/services');
const complaintRoutes = require('./routes/complaints');
const documentRoutes = require('./routes/documents');
const recommendationRoutes = require('./routes/recommendations');
const userRoutes = require('./routes/users');

// Use routes
app.use('/api/services', serviceRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/users', userRoutes);

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
