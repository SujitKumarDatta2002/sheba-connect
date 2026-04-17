const Solution = require("../models/Solution");
const Complaint = require("../models/Complaint");

// Submit a new solution (user)
const submitSolution = async (req, res) => {
  try {
    const {
      department,
      issueKeyword,
      title,
      description,
      steps,
      complaintId
    } = req.body;

    // Generate tags from keywords
    const tags = [
      ...new Set(
        issueKeyword.toLowerCase()
          .split(' ')
          .filter(word => word.length > 2)
      )
    ];

    // Create solution (initially not visible)
    const solution = new Solution({
      userId: req.user.userId,
      department,
      issueKeyword,
      title,
      description,
      steps: steps || [],
      tags,
      complaintId,
      status: "Pending",
      verified: false,
      isVisible: false
    });

    await solution.save();

    res.status(201).json({
      message: "Solution submitted successfully. It will be reviewed by admin.",
      solution: {
        _id: solution._id,
        title: solution.title,
        status: solution.status,
        createdAt: solution.createdAt
      }
    });

  } catch (error) {
    console.error("Error submitting solution:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's own solutions
const getMySolutions = async (req, res) => {
  try {
    const solutions = await Solution.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(solutions);
  } catch (error) {
    console.error("Error fetching solutions:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get visible solutions for all users (approved only)
const getPublicSolutions = async (req, res) => {
  try {
    const { department, keyword } = req.query;

    let query = { 
      status: "Approved",
      verified: true,
      isVisible: true 
    };

    if (department) {
      query.department = department;
    }

    if (keyword) {
      query.$or = [
        { issueKeyword: { $regex: keyword, $options: 'i' } },
        { tags: { $in: keyword.toLowerCase().split(' ') } },
        { title: { $regex: keyword, $options: 'i' } }
      ];
    }

    const solutions = await Solution.find(query)
      .populate('userId', 'name')
      .sort({ helpfulCount: -1, createdAt: -1 })
      .limit(20);

    res.json(solutions);
  } catch (error) {
    console.error("Error fetching public solutions:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single solution (with permission check)
const getSolutionById = async (req, res) => {
  try {
    const { id } = req.params;
    const solution = await Solution.findById(id)
      .populate('userId', 'name email')
      .populate('verifiedBy', 'name');

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    // Check visibility permissions
    const canView = 
      solution.isVisible || // Public
      solution.userId.toString() === req.user.userId || // Owner
      req.user.role === 'admin'; // Admin

    if (!canView) {
      return res.status(403).json({ message: "Solution not available" });
    }

    res.json(solution);
  } catch (error) {
    console.error("Error fetching solution:", error);
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get pending solutions for verification
const getPendingSolutions = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const solutions = await Solution.find({ 
      status: "Pending",
      verified: false 
    })
    .populate('userId', 'name email')
    .sort({ createdAt: 1 });

    res.json(solutions);
  } catch (error) {
    console.error("Error fetching pending solutions:", error);
    res.status(500).json({ message: error.message });
  }
};

// Admin: Verify/Reject solution
const verifySolution = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.params;
    const { status, adminFeedback } = req.body; // status: "Approved" or "Rejected"

    const solution = await Solution.findById(id);
    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    solution.status = status;
    solution.verified = status === "Approved";
    solution.verifiedBy = req.user.userId;
    solution.verifiedAt = new Date();
    solution.isVisible = status === "Approved";
    
    if (adminFeedback) {
      solution.adminFeedback = adminFeedback;
    }

    await solution.save();

    res.json({
      message: `Solution ${status.toLowerCase()} successfully`,
      solution
    });

  } catch (error) {
    console.error("Error verifying solution:", error);
    res.status(500).json({ message: error.message });
  }
};

// User: Mark solution as helpful/not helpful
const rateSolution = async (req, res) => {
  try {
    const { id } = req.params;
    const { helpful } = req.body; // boolean

    const solution = await Solution.findById(id);
    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    if (helpful) {
      solution.helpfulCount += 1;
    } else {
      solution.notHelpfulCount += 1;
    }

    await solution.save();

    res.json({
      message: "Thank you for your feedback",
      helpfulCount: solution.helpfulCount,
      notHelpfulCount: solution.notHelpfulCount
    });

  } catch (error) {
    console.error("Error rating solution:", error);
    res.status(500).json({ message: error.message });
  }
};

// User: Update own solution (before verification)
const updateSolution = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const solution = await Solution.findOne({ 
      _id: id, 
      userId: req.user.userId 
    });

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    // Can only update if still pending
    if (solution.status !== "Pending") {
      return res.status(400).json({ 
        message: "Cannot update solution after verification" 
      });
    }

    // Update fields
    Object.assign(solution, updates);
    solution.updatedAt = new Date();

    await solution.save();

    res.json({
      message: "Solution updated successfully",
      solution
    });

  } catch (error) {
    console.error("Error updating solution:", error);
    res.status(500).json({ message: error.message });
  }
};

// User: Delete own solution
const deleteSolution = async (req, res) => {
  try {
    const { id } = req.params;

    const solution = await Solution.findOne({ 
      _id: id, 
      userId: req.user.userId 
    });

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    await solution.deleteOne();

    res.json({ message: "Solution deleted successfully" });

  } catch (error) {
    console.error("Error deleting solution:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitSolution,
  getMySolutions,
  getPublicSolutions,
  getSolutionById,
  getPendingSolutions,
  verifySolution,
  rateSolution,
  updateSolution,
  deleteSolution
};