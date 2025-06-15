import User from "../models/user.js"; // Make sure the path and extension match your setup
import jwt from "jsonwebtoken";
export default async function register(req, res, next) {
  try {
    const {
      fullName,
      email,
      password,
      role,
      phone,
      address,
      dateOfBirth,
      gender,
    } = req.body;

    // Basic validation (you can expand this)
    if (!fullName || !email || !password || !phone || !dateOfBirth) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password,
      role,
      phone,
      address,
      dateOfBirth,
      gender,
    });

    await newUser.save();

    // You can choose what to send back (usually not the password)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    next(error);
  }
}


export default async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    next(error); // Pass to global error handler
  }
}
