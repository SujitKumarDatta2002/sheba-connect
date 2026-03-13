const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// Create complaint
router.post("/create", async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all complaints
router.get("/", async (req, res) => {
  const complaints = await Complaint.find();
  res.json(complaints);
});

// Delete complaint
router.delete("/:id", async (req, res) => {
  try {

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({ message: "Complaint deleted successfully" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
});



module.exports = router;