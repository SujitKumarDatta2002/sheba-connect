const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes (without database)
const serviceRoutes = require('./routes/services-new');
const complaintRoutes = require('./routes/complaints-new');

// Use routes
app.use('/api/services', serviceRoutes);
app.use('/api/complaints', complaintRoutes);

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('🚀 APIs ready for testing!');
  console.log('📊 Using mock data (no database connection)');
  console.log('🌐 Frontend: http://localhost:3000');
  console.log('🔧 Backend: http://localhost:' + PORT + '/api');
});
