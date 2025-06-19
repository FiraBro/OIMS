import PolicyApplication from "../models/policyAplication.js";

export const applyForPolicy = async (req, res, next) => {
  try {
    const { planId } = req.body;
    const documents = req.files.map((file) => file.path);

    const newApplication = new PolicyApplication({
      user: req.user._id,
      planId,
      documents,
    });

    const policyNumber = `POL-${req.user._id
      .toString()
      .slice(-5)}-${Date.now()}`;

    // Assign policyNumber to the plan before saving
    newApplication.policyNumber = policyNumber; // ⚠️ Critical fix
    await newApplication.save();
    res
      .status(201)
      .json({ message: "Application submitted", application: newApplication });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to apply for policy", details: err.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await PolicyApplication.find()
      .populate("user", "name email")
      .populate("planId", "name");
    res.json(applications);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch applications", details: err.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const validStatuses = ["Approved", "Rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const application = await PolicyApplication.findByIdAndUpdate(
      req.params.id,
      { status, remarks },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({ message: "Application updated", application });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update status", details: err.message });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const applications = await PolicyApplication.find({ user: req.user._id })
      .populate("planId", "name premium durationMonths") // Optional
      .sort({ createdAt: -1 }); // Most recent first

    res.json(applications);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch user applications",
      details: err.message,
    });
  }
};
