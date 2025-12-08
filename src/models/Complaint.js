const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema(
  {
    evidence_id: { type: String, required: true }
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    // --- Who submitted the complaint ---
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // --- Basic details ---
    name: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, required: true },

    // --- Incident details ---
    complaintType: { type: String, required: true },
    incidentDate: { type: String, required: true },
    incidentTime: { type: String, required: true },
    description: { type: String, required: true },
    suspectedSource: { type: String },

    evidences: {
      type: [evidenceSchema],
      // Stores structured metadata for each uploaded evidence
      default: []
    },

    // --- Recommended additional fields ---
    status: {
      type: String,
      enum: ["Pending", "In Review", "Resolved", "Rejected"],
      default: "Pending"
    },

    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: null
    },

    trackingId: {
      type: String,
      unique: true,
      required: true
    },

    lastUpdated: { 
      type: Date, 
      default: Date.now 
    }
  },
  { timestamps: true } // createdAt, updatedAt
);

module.exports = mongoose.model("Complaint", complaintSchema, "complaints_master_table");
