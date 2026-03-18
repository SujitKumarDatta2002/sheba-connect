// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");

// // Import models
// require("./models/User");
// require("./models/Complaint");
// require("./models/UserDocument");

// const app = express();

// // Connect to database
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve uploaded documents
// app.use("/uploads", express.static("uploads"));

// // Test route
// app.get("/", (req, res) => {
//   res.send("ShebaConnect Backend Running");
// });

// // Auth routes
// const authRoutes = require("./routes/authRoutes");
// app.use("/api/auth", authRoutes);

// // Complaint routes
// const complaintRoutes = require("./routes/complaintRoutes");
// app.use("/api/complaints", complaintRoutes);

// // Document routes
// const documentRoutes = require("./routes/documentRoutes");
// app.use("/api/documents", documentRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require('path'); // Add this import

// Import models
require("./models/User");
require("./models/Complaint");
require("./models/UserDocument");

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

// Add this with your other routes
const solutionRoutes = require("./routes/solutionRoutes");
app.use("/api/solutions", solutionRoutes);

// Add this with your other routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);


// Routes
app.get("/", (req, res) => {
  res.send("ShebaConnect Backend Running");
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected!" });
});

// Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Complaint routes
const complaintRoutes = require("./routes/complaintRoutes");
app.use("/api/complaints", complaintRoutes);

// Document routes
const documentRoutes = require("./routes/documentRoutes");
app.use("/api/documents", documentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});