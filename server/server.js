require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// CONNECT DATABASE
connectDB();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("ShebaConnect Backend Running");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected!" });
});
const complaintRoutes = require("./routes/complaintRoutes");

app.use("/api/complaints", complaintRoutes);
const PORT = process.env.PORT || 5000;

const documentRoutes = require("./routes/documentRoutes");

app.use("/api/documents", documentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});