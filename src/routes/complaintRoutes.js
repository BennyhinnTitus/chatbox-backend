const { protect } = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRoleMiddleware');
const Complaint = require('../models/Complaint');
const { uploadEvidences } = require('../utils/uploadEvidences');
const multer = require("multer");
const upload = multer();

const router = require('express').Router();

// Helper: generate tracking ID
const generateTrackingId = () => {
  return "CMP-" + Date.now();
};

router.post('/', upload.array("evidences"), async (req, res) => {
  try {
    const {
      submittedBy, // <-- add this
      name,
      designation,
      department,
      location,
      complaintType,
      incidentDate,
      incidentTime,
      description,
      suspectedSource,
      evidences
    } = req.body || {};
console.log("Received complaint data:", req.body);
    // if (!submittedBy) {
    //   return res.status(400).json({ error: "submittedBy (user ID) is required" });
    // }

    console.log("input evidences:", req.files); // fixed

    // call the correct function with req.files
    const evidenceURLs = await uploadEvidences(req.files || []);

    const trackingId = generateTrackingId();

    const savedComplaint = await Complaint.create({
      submittedBy,        // <-- include it here
      trackingId,
      name,
      designation,
      department,
      location,
      complaintType,
      incidentDate,
      incidentTime,
      description,
      suspectedSource,
      evidences: evidenceURLs
    });

    return res.status(201).json({
      success: true,
      message: "Complaint filed successfully.",
      trackingId,
      data: savedComplaint
    });

  } catch (err) {
    console.error('Error saving complaint:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


// Get a complaint by tracking ID
router.get('/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;
    const complaint = await Complaint.findOne({ trackingId }).populate('submittedBy assignedOfficer', 'name email');
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.status(200).json(complaint);
  } catch (err) {
    console.error('Error fetching complaint:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Get all complaints rised by a specific user
router.get('/my-complaints', protect, async (req, res) => {
  try {
    const userId = req.user._id; // extracted from JWT token by protect()

    const complaints = await Complaint.find({ submittedBy: userId })
      .populate('assignedOfficer', 'fullName email');

    res.status(200).json(complaints);
  } catch (err) {
    console.error('Error fetching user complaints:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Update complaint status and/or preority and/or assigned officer
router.put(
  '/update/:trackingId',
  protect,             // verifies token + loads req.user
  checkRole("CERT"),   // only CERT can continue
  async (req, res) => {
    try {
      const { trackingId } = req.params;
      const { status, priority, assignedOfficer } = req.body;
      const updateData = {};

      if (status) updateData.status = status;
      if (priority) updateData.priority = priority;
      if (assignedOfficer) updateData.assignedOfficer = assignedOfficer;

      updateData.lastUpdated = Date.now();

      const updatedComplaint = await Complaint.findOneAndUpdate(
        { trackingId },
        { $set: updateData },
        { new: true }
      );

      if (!updatedComplaint) {
        return res.status(404).json({ error: 'Complaint not found' });
      }

      res.status(200).json(updatedComplaint);
    } catch (err) {
      console.error('Error updating complaint:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);



// Get all complaints for CERT only
router.get('/all-complaints', protect, checkRole("CERT"), async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('submittedBy assignedOfficer', 'name email');

    res.status(200).json(complaints);
  } catch (err) {
    console.error('Error fetching complaints:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
