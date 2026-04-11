// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const path = require('path');

// const serviceRoutes = require('./routes/serviceRoutes');
// const helplineRoutes = require('./routes/helplineRoutes');

// const aiRoutes = require("./routes/ai");
// // Import models
// require("./models/User");
// require("./models/Complaint");
// require("./models/UserDocument");

// const app = express();

// // Connect to database
// connectDB();

// // Middleware
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// // Serve uploaded files statically
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use("/api/ai", aiRoutes);
// // Add routes
// const solutionRoutes = require("./routes/solutionRoutes");
// app.use("/api/solutions", solutionRoutes);

// const adminRoutes = require("./routes/adminRoutes");
// app.use("/api/admin", adminRoutes);

// // Routes
// app.get("/", (req, res) => {
//   res.send("ShebaConnect Backend Running");
// });

// const publicRoutes = require("./routes/publicRoutes");
// app.use("/api", publicRoutes);

// // Test route
// app.get("/api/test", (req, res) => {
//   res.json({ message: "Backend connected!" });
// });

// // Auth routes
// const authRoutes = require("./routes/authRoutes");
// app.use("/api/auth", authRoutes);

// // Report routes
// const reportRoutes = require("./routes/reportRoutes");
// app.use("/api/reports", reportRoutes);

// // User stats routes
// const userStatsRoutes = require("./routes/userStatsRoutes");
// app.use("/api/users", userStatsRoutes);

// // Stats routes - FIXED: Add this with the correct path
// const statsRoutes = require("./routes/statsRoutes");
// app.use("/api/stats", statsRoutes);  // This will make the endpoint: /api/stats/system

// // Complaint routes
// const complaintRoutes = require("./routes/complaintRoutes");
// app.use("/api/complaints", complaintRoutes);

// // Document routes
// const documentRoutes = require("./routes/documentRoutes");
// app.use("/api/documents", documentRoutes);

// // User profile routes
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);

// app.use('/api/services', serviceRoutes);
// app.use('/api/helplines', helplineRoutes);


// const officeRoutes = require('./routes/officeRoutes');
// app.use('/api/offices', officeRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require('path');

const serviceRoutes = require('./routes/serviceRoutes');
const helplineRoutes = require('./routes/helplineRoutes');
const aiRoutes = require("./routes/ai");

// Import models - ADD Survey here
require("./models/User");
require("./models/Complaint");
require("./models/UserDocument");
require("./models/Survey");  // <-- ADD THIS LINE
require("./models/Solution");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/ai", aiRoutes);

// Add routes
const solutionRoutes = require("./routes/solutionRoutes");
app.use("/api/solutions", solutionRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("ShebaConnect Backend Running");
});

const publicRoutes = require("./routes/publicRoutes");
app.use("/api", publicRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected!" });
});

// Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Report routes
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

// User stats routes
const userStatsRoutes = require("./routes/userStatsRoutes");
app.use("/api/users", userStatsRoutes);

// Stats routes
const statsRoutes = require("./routes/statsRoutes");
app.use("/api/stats", statsRoutes);

// Complaint routes
const complaintRoutes = require("./routes/complaintRoutes");
app.use("/api/complaints", complaintRoutes);

// Document routes
const documentRoutes = require("./routes/documentRoutes");
app.use("/api/documents", documentRoutes);

// User profile routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Survey routes - ADD THIS
const surveyRoutes = require("./routes/surveyRoutes");
app.use("/api/surveys", surveyRoutes);

app.use('/api/services', serviceRoutes);
app.use('/api/helplines', helplineRoutes);

const officeRoutes = require('./routes/officeRoutes');
app.use('/api/offices', officeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});