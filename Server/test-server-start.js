// Simple test to check server startup without database
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Server test successful!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected!", status: "ok" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Server startup successful!');
});
