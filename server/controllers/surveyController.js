const Survey = require("../models/Survey");
const Complaint = require("../models/Complaint");
const Solution = require("../models/Solution");
const ResolutionTime = require("../models/ResolutionTime");

// Submit survey for resolved complaint
const submitSurvey = async (req, res) => {
  try {
    const { complaintId, issueDate, resolveDate, feedback, solution, satisfaction, helpful } = req.body;
    
    // Check if complaint exists and belongs to user
    const complaint = await Complaint.findOne({
      _id: complaintId,
      userId: req.user.userId
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Check if survey already exists
    const existingSurvey = await Survey.findOne({ complaintId });
    if (existingSurvey) {
      return res.status(400).json({ message: "Survey already submitted for this complaint" });
    }

    // Calculate resolution time in days
    const start = new Date(issueDate);
    const end = new Date(resolveDate);
    const resolutionTime = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Generate tags from issue keyword
    const tags = complaint.issueKeyword.toLowerCase()
      .split(' ')
      .filter(word => word.length > 2);

    // Create survey
    const survey = new Survey({
      complaintId,
      userId: req.user.userId,
      department: complaint.department,
      issueKeyword: complaint.issueKeyword,
      issueDate,
      resolveDate,
      resolutionTime,
      feedback,
      solution,
      satisfaction,
      helpful,
      tags
    });

    await survey.save();

    // Update complaint status
    await Complaint.findByIdAndUpdate(complaintId, {
      status: "Resolved",
      $push: {
        timeline: {
          status: "Resolved",
          comment: "Complaint resolved and survey submitted",
          updatedBy: req.user.userId,
          date: new Date()
        }
      }
    });

    res.status(201).json({
      message: "Survey submitted successfully",
      survey
    });

  } catch (error) {
    console.error("Survey submission error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get similar solutions based on department and keywords
const getSimilarSolutions = async (req, res) => {
  try {
    const { department, keyword } = req.query;
    
    // Find similar surveys
    const surveys = await Survey.find({
      department,
      $or: [
        { issueKeyword: { $regex: keyword, $options: 'i' } },
        { tags: { $in: keyword.toLowerCase().split(' ') } }
      ]
    })
    .populate('userId', 'name')
    .sort({ helpful: -1, createdAt: -1 })
    .limit(10);

    // Calculate average resolution time
    const avgResolutionTime = surveys.length > 0
      ? Math.ceil(surveys.reduce((sum, s) => sum + s.resolutionTime, 0) / surveys.length)
      : null;

    // Get admin estimated time
    const adminTime = await ResolutionTime.findOne({ department });

    res.json({
      surveys,
      avgResolutionTime,
      adminEstimatedDays: adminTime?.estimatedDays || null,
      count: surveys.length
    });

  } catch (error) {
    console.error("Error fetching solutions:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get solution details with comments
const getSolutionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const survey = await Survey.findById(id)
      .populate('userId', 'name email')
      .populate({
        path: 'complaintId',
        populate: {
          path: 'timeline.updatedBy',
          select: 'name'
        }
      });

    if (!survey) {
      return res.status(404).json({ message: "Solution not found" });
    }

    // Get associated solution if exists
    const solution = await Solution.findOne({ surveyId: id })
      .populate('userId', 'name')
      .populate('comments.userId', 'name');

    res.json({
      survey,
      solution: solution || null
    });

  } catch (error) {
    console.error("Error fetching solution details:", error);
    res.status(500).json({ message: error.message });
  }
};

// Mark solution as helpful/not helpful
const rateSolution = async (req, res) => {
  try {
    const { id } = req.params;
    const { helpful } = req.body; // boolean

    const update = helpful
      ? { $inc: { helpful: 1 } }
      : { $inc: { notHelpful: 1 } };

    const solution = await Solution.findByIdAndUpdate(id, update, { new: true });

    res.json({ message: "Rating updated", solution });

  } catch (error) {
    console.error("Error rating solution:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add comment to solution
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const solution = await Solution.findById(id);
    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    solution.comments.push({
      userId: req.user.userId,
      userName: req.user.name,
      comment,
      createdAt: new Date()
    });

    await solution.save();

    res.json({ message: "Comment added", solution });

  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: error.message });
  }
};

// Admin: Set estimated resolution time for department
const setResolutionTime = async (req, res) => {
  try {
    const { department, estimatedDays } = req.body;

    const resolutionTime = await ResolutionTime.findOneAndUpdate(
      { department },
      { estimatedDays, updatedBy: req.user.userId, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({
      message: "Resolution time updated",
      resolutionTime
    });

  } catch (error) {
    console.error("Error setting resolution time:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get resolution time statistics
const getResolutionStats = async (req, res) => {
  try {
    const { department } = req.query;

    const match = department ? { department } : {};

    const stats = await Survey.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$department",
          avgResolutionTime: { $avg: "$resolutionTime" },
          minResolutionTime: { $min: "$resolutionTime" },
          maxResolutionTime: { $max: "$resolutionTime" },
          totalResolved: { $sum: 1 },
          avgSatisfaction: { $avg: "$satisfaction" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(stats);

  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitSurvey,
  getSimilarSolutions,
  getSolutionDetails,
  rateSolution,
  addComment,
  setResolutionTime,
  getResolutionStats
};