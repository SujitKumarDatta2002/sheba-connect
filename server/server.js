require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require('path');

const serviceRoutes = require('./routes/serviceRoutes');
const helplineRoutes = require('./routes/helplineRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const aiRoutes = require("./routes/ai");

// Import models
require("./models/User");
require("./models/Complaint");
require("./models/UserDocument");
require("./models/Survey");
require("./models/Solution");
require("./models/Appointment");

const app = express();

// Connect to database
connectDB();

// CORS Middleware
app.use(cors({
  origin: [
    'https://sheba-connect-eight.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options(/(.*)/, cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// ROUTE REGISTRATIONS - ORDER MATTERS!
// ============================================

// Root route
app.get("/", (req, res) => {
  res.send("ShebaConnect Backend Running");
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected!" });
});

// Public routes (no auth required)
const publicRoutes = require("./routes/publicRoutes");
app.use("/api", publicRoutes);

// Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// User routes (for profile, appointments, etc.)
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Complaint routes
const complaintRoutes = require("./routes/complaintRoutes");
app.use("/api/complaints", complaintRoutes);

// Admin routes (includes appointment management)
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

// Appointment routes
const appointmentRoutes = require("./routes/appointmentRoutes");
app.use("/api", appointmentRoutes);

// AI routes
app.use("/api/ai", aiRoutes);

// Solution routes
const solutionRoutes = require("./routes/solutionRoutes");
app.use("/api/solutions", solutionRoutes);

// Document routes
const documentRoutes = require("./routes/documentRoutes");
app.use("/api/documents", documentRoutes);

// Stats routes
const statsRoutes = require("./routes/statsRoutes");
app.use("/api/stats", statsRoutes);

// User stats routes
const userStatsRoutes = require("./routes/userStatsRoutes");
app.use("/api/users/stats", userStatsRoutes);

// Report routes
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

// Service & helpline routes
app.use('/api/services', serviceRoutes);
app.use('/api/helplines', helplineRoutes);

// Survey routes
app.use('/api/surveys', surveyRoutes);

// Office routes
const officeRoutes = require('./routes/officeRoutes');
app.use('/api/offices', officeRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});