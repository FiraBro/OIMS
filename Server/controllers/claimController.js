import Claim from "../models/claim.js";
import sendEmail from "../utils/sendEmail.js";

export const submitClaim = async (req, res) => {
  try {
    const { policyNumber, reason } = req.body;
    const document = req.file?.path;

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

export const updateClaimStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const claim = await Claim.findById(id).populate("user");
    if (!claim) return res.status(404).json({ error: "Claim not found" });

    claim.status = status;
    claim.reviewedAt = new Date();
    await claim.save();

    // Optional: Send email
    await sendEmail({
      to: claim.user.email,
      subject: `Claim ${status}`,
      text: `Your claim has been ${status.toLowerCase()}.`,
    });

    res.json({ message: `Claim ${status}`, claim });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
