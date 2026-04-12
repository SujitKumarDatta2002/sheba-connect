// // const express = require('express');
// // const router = express.Router();
// // const Complaint = require('../models/Complaint');

// // router.get('/', async (req, res) => {
// //   try {
// //     const complaints = await Complaint.find()
// //       .populate('userId', 'name email')
// //       .sort({ createdAt: -1 });
// //     res.json(complaints);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // });

// // router.post('/create', async (req, res) => {
// //   try {
// //     console.log("Received data:", req.body);

// //     const requiredFields = [
// //       'userId', 
// //       'citizenName', 
// //       'citizenId', 
// //       'contactNumber', 
// //       'department', 
// //       'issueKeyword', 
// //       'description'
// //     ];
    
// //     for (const field of requiredFields) {
// //       if (!req.body[field]) {
// //         return res.status(400).json({ 
// //           message: `Missing required field: ${field}` 
// //         });
// //       }
// //     }

// //     const timeline = [
// //       {
// //         status: "Pending",
// //         comment: "Complaint submitted successfully",
// //         updatedBy: req.body.citizenName || "Citizen",
// //         date: new Date()
// //       }
// //     ];

// //     const date = new Date();
// //     const year = date.getFullYear().toString().slice(-2);
// //     const month = (date.getMonth() + 1).toString().padStart(2, '0');
// //     const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
// //     const complaintNumber = `CMP${year}${month}${random}`;

// //     const complaintData = {
// //       userId: req.body.userId,
// //       citizenName: req.body.citizenName,
// //       citizenId: req.body.citizenId,
// //       contactNumber: req.body.contactNumber,
// //       email: req.body.email || "",
// //       address: req.body.address || "",
// //       department: req.body.department,
// //       issueKeyword: req.body.issueKeyword,
// //       description: req.body.description,
// //       priority: req.body.priority || "medium",
// //       status: "Pending",
// //       complaintNumber: complaintNumber,
// //       timeline: timeline
// //     };

// //     console.log("Creating complaint with data:", complaintData);

// //     const complaint = new Complaint(complaintData);
// //     const newComplaint = await complaint.save();
    
// //     const populatedComplaint = await Complaint.findById(newComplaint._id)
// //       .populate('userId', 'name email');
    
// //     console.log("Saved complaint:", populatedComplaint);
// //     res.status(201).json(populatedComplaint);
    
// //   } catch (error) {
// //     console.error("Error saving complaint:", error);
// //     res.status(400).json({ message: error.message });
// //   }
// // });

// // router.put('/:id', async (req, res) => {
// //   try {
// //     const { status, comment, updatedBy } = req.body;
    
// //     const complaint = await Complaint.findById(req.params.id);
// //     if (!complaint) {
// //       return res.status(404).json({ message: 'Complaint not found' });
// //     }

// //     //timeline
// //     complaint.timeline.push({
// //       status: status || complaint.status,
// //       comment: comment || `Status updated to ${status || complaint.status}`,
// //       updatedBy: updatedBy || 'Admin',
// //       date: new Date()
// //     });

// //     if (status) {
// //       complaint.status = status;
// //     }

// //     const updatedComplaint = await complaint.save();
// //     const populatedComplaint = await Complaint.findById(updatedComplaint._id)
// //       .populate('userId', 'name email');
    
// //     res.json(populatedComplaint);
// //   } catch (error) {
// //     console.error("Error updating complaint:", error);
// //     res.status(400).json({ message: error.message });
// //   }
// // });

// // router.delete('/:id', async (req, res) => {
// //   try {
// //     await Complaint.findByIdAndDelete(req.params.id);
// //     res.json({ message: 'Complaint deleted successfully' });
// //   } catch (error) {
// //     console.error("Error deleting complaint:", error);
// //     res.status(500).json({ message: error.message });
// //   }
// // });

// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Complaint = require('../models/Complaint');
// const authMiddleware = require('../middleware/auth');

// // GET all complaints
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     let complaints;
//     const isAdmin = req.user.role === 'admin';
    
//     if (isAdmin) {
//       complaints = await Complaint.find()
//         .populate('userId', 'name email')
//         .sort({ createdAt: -1 });
//     } else {
//       complaints = await Complaint.find({}, {
//         citizenId: 0, contactNumber: 0, email: 0, address: 0
//       })
//         .populate('userId', 'name')
//         .sort({ createdAt: -1 });
//     }
//     res.json(complaints);
//   } catch (error) {
//     console.error('Error fetching complaints:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // GET user's own complaints
// router.get('/my', authMiddleware, async (req, res) => {
//   try {
//     const complaints = await Complaint.find({ userId: req.user.userId })
//       .sort({ createdAt: -1 });
//     res.json(complaints);
//   } catch (error) {
//     console.error('Error fetching my complaints:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // CREATE complaint
// router.post('/create', authMiddleware, async (req, res) => {
//   try {
//     console.log("=== CREATE COMPLAINT ===");
//     console.log("User:", req.user);
//     console.log("Body:", req.body);

//     const userId = req.user.userId;
//     if (!userId) {
//       return res.status(401).json({ message: 'User ID not found in token' });
//     }

//     // Validate required fields
//     const requiredFields = ['department', 'issueKeyword', 'description', 'citizenName', 'citizenId', 'contactNumber'];
//     for (const field of requiredFields) {
//       if (!req.body[field] || (typeof req.body[field] === 'string' && req.body[field].trim() === '')) {
//         return res.status(400).json({ message: `Missing required field: ${field}` });
//       }
//     }

//     const complaintData = {
//       userId: userId,
//       citizenName: req.body.citizenName.trim(),
//       citizenId: req.body.citizenId.trim(),
//       contactNumber: req.body.contactNumber.trim(),
//       email: req.body.email?.trim() || "",
//       address: req.body.address?.trim() || "",
//       department: req.body.department,
//       issueKeyword: req.body.issueKeyword.trim(),
//       description: req.body.description.trim(),
//       formalTemplate: req.body.formalTemplate || "",
//       priority: req.body.priority || "medium",
//       status: "Pending",
//       surveySubmitted: false
//     };

//     console.log("Saving complaint:", complaintData);

//     const complaint = new Complaint(complaintData);
//     const savedComplaint = await complaint.save();
    
//     console.log("Complaint saved with ID:", savedComplaint._id);
    
//     const populated = await Complaint.findById(savedComplaint._id)
//       .populate('userId', 'name email');
    
//     res.status(201).json(populated);
//   } catch (error) {
//     console.error('Error creating complaint:', error);
    
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(e => e.message);
//       return res.status(400).json({ message: errors.join(', ') });
//     }
    
//     if (error.code === 11000) {
//       return res.status(400).json({ message: 'Duplicate complaint number. Please try again.' });
//     }
    
//     res.status(400).json({ message: error.message });
//   }
// });

// // UPDATE complaint status (admin only)
// router.put('/:id/status', authMiddleware, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Admin access required' });
//     }

//     const { status, comment } = req.body;
//     const complaint = await Complaint.findById(req.params.id);
    
//     if (!complaint) {
//       return res.status(404).json({ message: 'Complaint not found' });
//     }

//     complaint.status = status;
//     complaint.timeline = complaint.timeline || [];
//     complaint.timeline.push({
//       status,
//       comment: comment || `Status updated to ${status} by admin`,
//       updatedBy: 'Admin',
//       date: new Date()
//     });

//     await complaint.save();
//     res.json(complaint);
//   } catch (error) {
//     console.error('Error updating status:', error);
//     res.status(400).json({ message: error.message });
//   }
// });

// // UPDATE complaint (citizen edit)
// router.put('/:id', authMiddleware, async (req, res) => {
//   try {
//     const complaint = await Complaint.findOne({
//       _id: req.params.id,
//       userId: req.user.userId
//     });

//     if (!complaint) {
//       return res.status(404).json({ message: 'Complaint not found or unauthorized' });
//     }

//     if (complaint.status === 'Resolved') {
//       return res.status(400).json({ message: 'Cannot edit resolved complaint' });
//     }

//     if (req.body.description) {
//       complaint.description = req.body.description;
//     }
//     if (req.body.formalTemplate) {
//       complaint.formalTemplate = req.body.formalTemplate;
//     }

//     await complaint.save();
//     res.json(complaint);
//   } catch (error) {
//     console.error('Error updating complaint:', error);
//     res.status(400).json({ message: error.message });
//   }
// });

// // DELETE complaint
// router.delete('/:id', authMiddleware, async (req, res) => {
//   try {
//     const isAdmin = req.user.role === 'admin';
//     let complaint;

//     if (isAdmin) {
//       complaint = await Complaint.findByIdAndDelete(req.params.id);
//     } else {
//       complaint = await Complaint.findOneAndDelete({ 
//         _id: req.params.id, 
//         userId: req.user.userId 
//       });
//     }

//     if (!complaint) {
//       return res.status(404).json({ message: 'Complaint not found or unauthorized' });
//     }
    
//     res.json({ message: 'Complaint deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting complaint:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const authMiddleware = require('../middleware/auth');

// GET all complaints - Show all complaints to everyone, but restrict sensitive data
router.get('/', authMiddleware, async (req, res) => {
  try {
    let complaints;
    const isAdmin = req.user.role === 'admin';
    
    if (isAdmin) {
      // Admin sees all complaints with all fields
      complaints = await Complaint.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Regular users see all complaints but with limited info
      complaints = await Complaint.find({}, {
        // Exclude sensitive personal info from other users' complaints
        citizenId: 0,
        contactNumber: 0,
        email: 0,
        address: 0
      })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
      
      // For the user's own complaints, we need to include full details
      // We'll handle this in the frontend by fetching separately or merging
    }
    
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET user's own complaints with full details
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

// GET single complaint by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('adminFeedback.askedBy', 'name')
      .populate('adminFeedback.response.respondedBy', 'name');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Check if user has permission to view full details
    const isAdmin = req.user.role === 'admin';
    const isOwner = complaint.userId._id.toString() === req.user.userId;
    
    if (!isAdmin && !isOwner) {
      // Return limited data for non-owners
      const limitedComplaint = {
        _id: complaint._id,
        complaintNumber: complaint.complaintNumber,
        department: complaint.department,
        issueKeyword: complaint.issueKeyword,
        description: complaint.description,
        status: complaint.status,
        priority: complaint.priority,
        createdAt: complaint.createdAt,
        timeline: complaint.timeline
      };
      return res.json(limitedComplaint);
    }
    
    res.json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET appointments linked to a complaint
router.get('/:id/appointments', authMiddleware, async (req, res) => {
  try {
    const Appointment = require('../models/Appointment');
    const complaint = await Complaint.findById(req.params.id).select('userId');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = complaint.userId.toString() === req.user.userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Unauthorized to view complaint appointments' });
    }

    const appointments = await Appointment.find({ complaintId: req.params.id })
      .populate('adminId', 'name email phone')
      .populate('userId', 'name email phone')
      .populate('complaintId', 'complaintNumber description status')
      .sort({ appointmentDate: -1, createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching complaint appointments:', error);
    res.status(500).json({ message: error.message });
  }
});

// CREATE a new complaint
router.post('/create', authMiddleware, async (req, res) => {
  try {
    console.log("Received complaint data:", req.body);
    
    // Validate required fields
    const requiredFields = ['department', 'issueKeyword', 'description', 'citizenName', 'citizenId', 'contactNumber'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    const timeline = [
      {
        status: "Pending",
        comment: "Complaint submitted successfully",
        updatedBy: req.body.citizenName,
        date: new Date()
      }
    ];

    const complaintData = {
      userId: req.user.userId,
      citizenName: req.body.citizenName,
      citizenId: req.body.citizenId,
      contactNumber: req.body.contactNumber,
      email: req.body.email || "",
      address: req.body.address || "",
      department: req.body.department,
      issueKeyword: req.body.issueKeyword,
      description: req.body.description,
      priority: req.body.priority || "medium",
      status: "Pending",
      timeline: timeline,
      formalTemplate: req.body.formalTemplate || ""
    };

    console.log("Creating complaint with data:", complaintData);

    const complaint = new Complaint(complaintData);
    const savedComplaint = await complaint.save();
    
    console.log("Complaint saved successfully:", savedComplaint._id);
    res.status(201).json(savedComplaint);
    
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(400).json({ message: error.message });
  }
});

// UPDATE complaint - Citizen edit with tracking
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.status === 'Resolved') {
      return res.status(400).json({ message: 'Cannot edit resolved complaint' });
    }

    // Track changes
    const changes = {};
    let hasChanges = false;
    
    if (req.body.description && req.body.description !== complaint.description) {
      changes.previousDescription = complaint.description;
      changes.newDescription = req.body.description;
      complaint.description = req.body.description;
      hasChanges = true;
    }
    
    if (req.body.formalTemplate && req.body.formalTemplate !== complaint.formalTemplate) {
      changes.previousTemplate = complaint.formalTemplate;
      changes.newTemplate = req.body.formalTemplate;
      complaint.formalTemplate = req.body.formalTemplate;
      hasChanges = true;
    }

    if (hasChanges) {
      // Add to edit history
      if (!Array.isArray(complaint.editHistory)) {
        complaint.editHistory = [];
      }
      complaint.editHistory.push({
        editedAt: new Date(),
        previousDescription: changes.previousDescription,
        newDescription: changes.newDescription,
        previousTemplate: changes.previousTemplate,
        newTemplate: changes.newTemplate,
        editReason: req.body.editReason || 'User edited the complaint',
        statusAtEdit: complaint.status,
        reviewedByAdmin: false
      });
      
      // Add to timeline
      if (!Array.isArray(complaint.timeline)) {
        complaint.timeline = [];
      }
      complaint.timeline.push({
        status: complaint.status,
        comment: `Complaint edited by citizen. Reason: ${req.body.editReason || 'Updated information'}`,
        updatedBy: complaint.citizenName,
        date: new Date()
      });
    }

    await complaint.save();
    
    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('userId', 'name email');
    
    res.json(populatedComplaint);
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

// ADD admin feedback
router.post('/:id/feedback', authMiddleware, async (req, res) => {
  try {
    // Validate MongoDB ObjectId
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid complaint ID format' });
    }
    
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Only admin can add feedback
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can add feedback' });
    }

    if (!req.body.message || req.body.message.trim() === '') {
      return res.status(400).json({ message: 'Feedback message is required' });
    }

    complaint.adminFeedback = complaint.adminFeedback || [];
    const newFeedback = {
      message: req.body.message.trim(),
      askedBy: req.user.userId,
      askedAt: new Date(),
      isQuestion: req.body.isQuestion || false,
      requiresResponse: req.body.requiresResponse || false
    };
    
    complaint.adminFeedback.push(newFeedback);
    
    // Add to timeline
    complaint.timeline.push({
      status: complaint.status,
      comment: `Admin ${req.body.isQuestion ? 'question' : 'feedback'}: ${req.body.message.substring(0, 100)}${req.body.message.length > 100 ? '...' : ''}`,
      updatedBy: 'Admin',
      date: new Date()
    });

    await complaint.save();
    
    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('adminFeedback.askedBy', 'name');
    
    res.json(populatedComplaint);
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(400).json({ message: error.message });
  }
});

// RESPOND to feedback (citizen response)
router.post('/:id/respond', authMiddleware, async (req, res) => {
  try {
    // Validate MongoDB ObjectId
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid complaint ID format' });
    }
    
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found or unauthorized' });
    }

    if (!req.body.feedbackId) {
      return res.status(400).json({ message: 'Feedback ID is required' });
    }

    if (!req.body.response || req.body.response.trim() === '') {
      return res.status(400).json({ message: 'Response is required' });
    }

    const feedback = complaint.adminFeedback?.id(req.body.feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.response = {
      text: req.body.response.trim(),
      respondedAt: new Date(),
      respondedBy: req.user.userId
    };
    
    // Add to timeline
    complaint.timeline.push({
      status: complaint.status,
      comment: `Citizen responded to admin: ${req.body.response.substring(0, 100)}${req.body.response.length > 100 ? '...' : ''}`,
      updatedBy: complaint.citizenName,
      date: new Date()
    });

    await complaint.save();
    
    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('adminFeedback.askedBy', 'name')
      .populate('adminFeedback.response.respondedBy', 'name');
    
    res.json(populatedComplaint);
  } catch (error) {
    console.error('Error responding to feedback:', error);
    res.status(400).json({ message: error.message });
  }
});

// ADMIN: Mark edit as reviewed
router.put('/:id/edits/:editId/review', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    const edit = complaint.editHistory?.id(req.params.editId);
    if (!edit) {
      return res.status(404).json({ message: 'Edit history not found' });
    }
    
    edit.reviewedByAdmin = true;
    await complaint.save();
    
    res.json({ message: 'Edit marked as reviewed' });
  } catch (error) {
    console.error('Error reviewing edit:', error);
    res.status(400).json({ message: error.message });
  }
});

// ADMIN: Update complaint status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { status, comment } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    if (!['Pending', 'Processing', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }
    
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Ensure timeline is an array
    if (!Array.isArray(complaint.timeline)) {
      complaint.timeline = [];
    }

    complaint.status = status;
    complaint.timeline.push({
      status,
      comment: comment || `Status updated to ${status} by admin`,
      updatedBy: 'Admin',
      date: new Date()
    });
    
    await complaint.save();
    
    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('userId', 'name email');
    
    res.json(populatedComplaint);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: error.message });
  }
});

// USER: Edit own complaint (tracks changes)
router.put('/:id/edit', authMiddleware, async (req, res) => {
  try {
    const { description, formalTemplate, editReason } = req.body;
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found or unauthorized' });
    }

    // Initialize arrays if needed
    if (!Array.isArray(complaint.editHistory)) {
      complaint.editHistory = [];
    }
    if (!Array.isArray(complaint.timeline)) {
      complaint.timeline = [];
    }

    // Store edit history
    if (description && description !== complaint.description) {
      complaint.editHistory.push({
        editedAt: new Date(),
        previousDescription: complaint.description,
        newDescription: description,
        editReason: editReason || 'No reason provided',
        statusAtEdit: complaint.status,
        reviewedByAdmin: false
      });
      complaint.description = description;
    }

    if (formalTemplate && formalTemplate !== complaint.formalTemplate) {
      complaint.editHistory.push({
        editedAt: new Date(),
        previousTemplate: complaint.formalTemplate,
        newTemplate: formalTemplate,
        editReason: editReason || 'No reason provided',
        statusAtEdit: complaint.status,
        reviewedByAdmin: false
      });
      complaint.formalTemplate = formalTemplate;
    }

    // Add timeline entry
    complaint.timeline.push({
      status: complaint.status,
      comment: `Complaint edited by citizen: ${editReason || 'Updated complaint details'}`,
      updatedBy: complaint.citizenName,
      date: new Date()
    });

    await complaint.save();

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('userId', 'name email')
      .populate('editHistory.resolvedBy', 'name');

    res.json({
      message: 'Complaint updated successfully',
      complaint: populatedComplaint
    });
  } catch (error) {
    console.error('Error editing complaint:', error);
    res.status(400).json({ message: error.message });
  }
});

// PREVENT ADMIN from updating complaint details (only status and feedback allowed)
// This is implicit - the PUT route above checks userId ownership

module.exports = router;
