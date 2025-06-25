import Claim from "../models/claim.js";
import sendEmail from "../utils/sendEmail.js";

// Submit a new claim
export const submitClaim = async (req, res) => {
  try {
    const { policyNumber, reason } = req.body;
    const document = req.file?.path;

    if (!policyNumber || !reason) {
      return res
        .status(400)
        .json({ error: "Policy number and reason are required." });
    }

    const claim = new Claim({
      user: req.user._id,
      policyNumber,
      reason,
      document,
    });

    await claim.save();

    res.status(201).json({ message: "Claim submitted successfully", claim });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin updates the claim status
export const updateClaimStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["Approved", "Rejected"];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Only Approved or Rejected allowed." });
    }

    const claim = await Claim.findById(id).populate("user", "email name");
    if (!claim) {
      return res.status(404).json({ error: "Claim not found" });
    }

    claim.status = status;
    claim.reviewedAt = new Date();
    await claim.save();

    // Send notification email
    const userEmail = claim.user?.email;
    if (userEmail) {
      await sendEmail({
        to: userEmail,
        subject: `Your Claim has been ${status}`,
        text: `Dear ${
          claim.user.name || "User"
        },\n\nYour claim for policy number ${
          claim.policyNumber
        } has been ${status.toLowerCase()}.\n\nReason: ${
          claim.reason
        }\n\nRegards,\nHealth Insurance Team`,
      });
    }

    res.json({ message: `Claim ${status}`, claim });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getUserClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.user.id });

    res.json({ status: true, data: claims });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch claims",
      error: err.message,
    });
  }
};
export const getAllClaims = async (req, res) => {
  try {
    const claim = await Claim.find();
    if (!claim)
      return res.status(400).json({
        status: false,
        message: "No claim is found",
      });
    res.status(200).json({ status: true, data: claim });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
