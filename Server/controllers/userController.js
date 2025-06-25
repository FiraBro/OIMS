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
export async function deleteUser(req, res) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);
    if (!deleteUser)
      return res.status(400).json({
        status: false,
        message: "No deleted user",
      });
    res.status(200).json({
      status: true,
      message: "User deleted succusfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
}
export async function countUser(req, res) {
  try {
    // 1. Get the user count from database
    const userCount = await User.countDocuments(); // Using Mongoose

    // 2. Return successful response
    return res.status(200).json({
      success: true,
      count: userCount,
      message: `Found ${userCount} users in database`,
    });
  } catch (error) {
    console.error("Error counting users:", error);

    // 3. Return error response
    return res.status(500).json({
      success: false,
      message: "Failed to count users",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
