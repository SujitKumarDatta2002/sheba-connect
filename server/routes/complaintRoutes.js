// const express = require('express');
// const router = express.Router();
// const Complaint = require('../models/Complaint');

// router.get('/', async (req, res) => {
//   try {
//     const complaints = await Complaint.find()
//       .populate('userId', 'name email')
//       .sort({ createdAt: -1 });
//     res.json(complaints);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.post('/create', async (req, res) => {
//   try {
//     console.log("Received data:", req.body);

//     const requiredFields = [
//       'userId', 
//       'citizenName', 
//       'citizenId', 
//       'contactNumber', 
//       'department', 
//       'issueKeyword', 
//       'description'
//     ];
    
//     for (const field of requiredFields) {
//       if (!req.body[field]) {
//         return res.status(400).json({ 
//           message: `Missing required field: ${field}` 
//         });
//       }
//     }

//     const timeline = [
//       {
//         status: "Pending",
//         comment: "Complaint submitted successfully",
//         updatedBy: req.body.citizenName || "Citizen",
//         date: new Date()
//       }
//     ];

//     const date = new Date();
//     const year = date.getFullYear().toString().slice(-2);
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//     const complaintNumber = `CMP${year}${month}${random}`;

//     const complaintData = {
//       userId: req.body.userId,
//       citizenName: req.body.citizenName,
//       citizenId: req.body.citizenId,
//       contactNumber: req.body.contactNumber,
//       email: req.body.email || "",
//       address: req.body.address || "",
//       department: req.body.department,
//       issueKeyword: req.body.issueKeyword,
//       description: req.body.description,
//       priority: req.body.priority || "medium",
//       status: "Pending",
//       complaintNumber: complaintNumber,
//       timeline: timeline
//     };

//     console.log("Creating complaint with data:", complaintData);

//     const complaint = new Complaint(complaintData);
//     const newComplaint = await complaint.save();
    
//     const populatedComplaint = await Complaint.findById(newComplaint._id)
//       .populate('userId', 'name email');
    
//     console.log("Saved complaint:", populatedComplaint);
//     res.status(201).json(populatedComplaint);
    
//   } catch (error) {
//     console.error("Error saving complaint:", error);
//     res.status(400).json({ message: error.message });
//   }
// });

// router.put('/:id', async (req, res) => {
//   try {
//     const { status, comment, updatedBy } = req.body;
    
//     const complaint = await Complaint.findById(req.params.id);
//     if (!complaint) {
//       return res.status(404).json({ message: 'Complaint not found' });
//     }

//     //timeline
//     complaint.timeline.push({
//       status: status || complaint.status,
//       comment: comment || `Status updated to ${status || complaint.status}`,
//       updatedBy: updatedBy || 'Admin',
//       date: new Date()
//     });

//     if (status) {
//       complaint.status = status;
//     }

//     const updatedComplaint = await complaint.save();
//     const populatedComplaint = await Complaint.findById(updatedComplaint._id)
//       .populate('userId', 'name email');
    
//     res.json(populatedComplaint);
//   } catch (error) {
//     console.error("Error updating complaint:", error);
//     res.status(400).json({ message: error.message });
//   }
// });

// router.delete('/:id', async (req, res) => {
//   try {
//     await Complaint.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Complaint deleted successfully' });
//   } catch (error) {
//     console.error("Error deleting complaint:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const authMiddleware = require('../middleware/auth');

// GET all complaints
router.get('/', authMiddleware, async (req, res) => {
  try {
    let complaints;
    const isAdmin = req.user.role === 'admin';
    
    if (isAdmin) {
      complaints = await Complaint.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
    } else {
      complaints = await Complaint.find({}, {
        citizenId: 0, contactNumber: 0, email: 0, address: 0
      })
        .populate('userId', 'name')
        .sort({ createdAt: -1 });
    }
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET user's own complaints
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching my complaints:', error);
    res.status(500).json({ message: error.message });
  }
});

// CREATE complaint
router.post('/create', authMiddleware, async (req, res) => {
  try {
    console.log("=== CREATE COMPLAINT ===");
    console.log("User:", req.user);
    console.log("Body:", req.body);

    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    // Validate required fields
    const requiredFields = ['department', 'issueKeyword', 'description', 'citizenName', 'citizenId', 'contactNumber'];
    for (const field of requiredFields) {
      if (!req.body[field] || (typeof req.body[field] === 'string' && req.body[field].trim() === '')) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    const complaintData = {
      userId: userId,
      citizenName: req.body.citizenName.trim(),
      citizenId: req.body.citizenId.trim(),
      contactNumber: req.body.contactNumber.trim(),
      email: req.body.email?.trim() || "",
      address: req.body.address?.trim() || "",
      department: req.body.department,
      issueKeyword: req.body.issueKeyword.trim(),
      description: req.body.description.trim(),
      formalTemplate: req.body.formalTemplate || "",
      priority: req.body.priority || "medium",
      status: "Pending",
      surveySubmitted: false
    };

    console.log("Saving complaint:", complaintData);

    const complaint = new Complaint(complaintData);
    const savedComplaint = await complaint.save();
    
    console.log("Complaint saved with ID:", savedComplaint._id);
    
    const populated = await Complaint.findById(savedComplaint._id)
      .populate('userId', 'name email');
    
    res.status(201).json(populated);
  } catch (error) {
    console.error('Error creating complaint:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate complaint number. Please try again.' });
    }
    
    res.status(400).json({ message: error.message });
  }
});

// UPDATE complaint status (admin only)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status, comment } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    complaint.timeline = complaint.timeline || [];
    complaint.timeline.push({
      status,
      comment: comment || `Status updated to ${status} by admin`,
      updatedBy: 'Admin',
      date: new Date()
    });

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(400).json({ message: error.message });
  }
});

// UPDATE complaint (citizen edit)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found or unauthorized' });
    }

    if (complaint.status === 'Resolved') {
      return res.status(400).json({ message: 'Cannot edit resolved complaint' });
    }

    if (req.body.description) {
      complaint.description = req.body.description;
    }
    if (req.body.formalTemplate) {
      complaint.formalTemplate = req.body.formalTemplate;
    }

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE complaint
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    let complaint;

    if (isAdmin) {
      complaint = await Complaint.findByIdAndDelete(req.params.id);
    } else {
      complaint = await Complaint.findOneAndDelete({ 
        _id: req.params.id, 
        userId: req.user.userId 
      });
    }

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found or unauthorized' });
    }
    
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
