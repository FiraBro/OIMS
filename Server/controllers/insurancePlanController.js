import InsurancePlan from "../models/insurancePlan.js";

// Create Plan (admin only)
export async function createPlan(req, res) {
  try {
    const plan = new InsurancePlan(req.body);

    await plan.save();
    res.status(201).json({ status: true, data: plan });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Update Plan (admin only)
export async function updatePlan(req, res) {
  try {
    const plan = await InsurancePlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.status(200).json({ status: true, data: plan });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Delete Plan (admin only)
export async function deletePlan(req, res) {
  try {
    const plan = await InsurancePlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.status(200).json({ status: true, message: "Plan deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// List all Plans (admin only)
export async function listPlansAdmin(req, res) {
  try {
    const plans = await InsurancePlan.find();
    res.status(200).json({ status: true, data: plans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Public List Plans (customer access)
export async function listPlansPublic(req, res) {
  try {
    const plans = await InsurancePlan.find();
    res.status(200).json({ status: true, data: plans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function countPlan(req, res) {
  try {
    // 2. Get the plan count from database
    const planCount = await InsurancePlan.countDocuments();

    // 3. Return successful response
    if (!planCount)
      return res.status(400).json({
        status: false,
        message: "No plan is found",
      });
    res.status(200).json({
      status: true,
      count: planCount,
      message: `Found ${planCount} plans matching criteria`,
    });
  } catch (error) {
    console.error("Error counting plans:", error);

    // 4. Return error response
    res.status(400).json({
      status: false,
      count: 0,
      message: "Failed to count plans",
      error: error.message,
    });
  }
}
