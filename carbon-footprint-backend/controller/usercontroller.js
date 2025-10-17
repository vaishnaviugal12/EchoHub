import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";

/* ================================
   1️⃣ USER AUTHENTICATION
================================= */

// -------- SIGNUP --------
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// -------- LOGIN --------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // ❗set to true in production with HTTPS
      sameSite: "lax",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, role: user.role, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------- LOGOUT --------
export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(400).json({ error: "No token found" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store token in Redis blacklist
    await redisClient.set(`blacklist:${decoded.id}:${token}`, "true", { EX: 86400 });

    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================================
   2️⃣ PROFILE MANAGEMENT
================================= */
export const editProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, password } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true, select: "-password" }
    );

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: check if token is blacklisted in Redis
    const isBlacklisted = await redisClient.get(`blacklist:${decoded.id}:${token}`);
    if (isBlacklisted) return res.status(401).json({ error: "Token expired" });

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

/* ================================
   3️⃣ ECOLEADER REQUEST FLOW
================================= */

// -------- USER: Send Leader Request --------
export const requestLeader = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "Leader")
      return res.status(400).json({ message: "You are already an EcoLeader." });

    if (user.leaderRequestStatus === "pending")
      return res.status(400).json({ message: "Your request is already pending." });

    user.leaderRequestStatus = "pending";
    await user.save();

    res.json({ message: "Request sent successfully. Await admin approval." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------- ADMIN: View Pending Requests --------
export const getLeaderRequests = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Only admin allowed." });
    }

    const requests = await User.find({ leaderRequestStatus: "pending" }).select(
      "username email leaderRequestStatus"
    );

    // Debug log
    console.log("Pending requests found:", requests.length);
    console.log("Requests:", requests);

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------- ADMIN: Approve or Reject --------
export const handleLeaderRequest = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Only admin allowed." });
    }

    const { userId, action } = req.body; // action: "approve" or "reject"
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === "approve") {
      user.role = "Leader";
      user.leaderRequestStatus = "approved";
    } else if (action === "reject") {
      user.leaderRequestStatus = "rejected";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await user.save();
    res.json({ message: `Request ${action}d successfully.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
