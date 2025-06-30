import Claim from "../models/claim.js";
import sendEmail from "../utils/sendEmail.js";

// Status constants for consistency
const CLAIM_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

// Submit a new claim
export const submitClaim = async (req, res) => {
  try {
    const { policyNumber, reason } = req.body;
    const document = req.file?.path;

    // Validation
    if (!policyNumber || !reason) {
      return res.status(400).json({
        status: false,
        error: "Policy number and reason are required.",
      });
    }

    const claim = new Claim({
      user: req.user._id,
      policyNumber,
      reason,
      document,
      status: CLAIM_STATUS.PENDING, // Set initial status
    });

    await claim.save();

    res.status(201).json({
      status: true,
      message: "Claim submitted successfully",
      data: claim,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};

// Admin updates the claim status
export const updateClaimStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (![CLAIM_STATUS.APPROVED, CLAIM_STATUS.REJECTED].includes(status)) {
      return res.status(400).json({
        status: false,
        error: "Invalid status. Only Approved or Rejected allowed.",
      });
    }

    const claim = await Claim.findById(id).populate("user", "email name");
    if (!claim) {
      return res.status(404).json({
        status: false,
        error: "Claim not found",
      });
    }

    // Update claim
    claim.status = status;
    claim.reviewedAt = new Date();
    await claim.save();

    // Send notification email
    if (claim.user?.email) {
      await sendEmail({
        to: claim.user.email,
        subject: `Your Claim has been ${status}`,
        text: `Dear ${claim.user.name || "User"},
        \n\nYour claim for policy number ${
          claim.policyNumber
        } has been ${status.toLowerCase()}.
        \n\nReason: ${claim.reason}
        \n\nRegards,\nHealth Insurance Team`,
      });
    }

    res.json({
      status: true,
      message: `Claim ${status}`,
      data: claim,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};

// Get claims for logged-in user
export const getUserClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.user.id });
    res.json({
      status: true,
      data: claims,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch claims",
      error: err.message,
    });
  }
};

// Get all claims (admin)
export const getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find().populate("user", "name email");
    res.status(200).json({
      status: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Count approved claims
export const countApprovedClaims = async (req, res) => {
  try {
    const approvedCount = await Claim.countDocuments({
      status: CLAIM_STATUS.APPROVED,
    });
    res.status(200).json({
      status: true,
      count: approvedCount,
      message: `Found ${approvedCount} approved claims`,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to count approved claims",
      error: error.message,
    });
  }
};

export const totalClaims = async (req, res) => {
  try {
    const totalClaims = await Claim.countDocuments();
    res.status(200).json({
      status: true,
      totalClaims: totalClaims,
      message: `Found ${totalClaims} claims`,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to  fetch claims",
      error: error.message,
    });
  }
};
