import User from "../models/user.js";

export async function getAllUser(req, res, next) {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({
      status: true,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
}

export async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "No user found with this ID" });
    }
    res.status(200).json({
      status: true,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
}
