import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  ecoPoints: { 
    type: Number, 
    default: 0 
  },
  badges: { 
    type: [String], 
    default: [] 
  },

  // 🌱 New fields for EcoLeader feature
  role: { 
    type: String, 
    enum: ["User", "Leader", "Admin"], 
    default: "User" 
  },

  leaderRequestStatus: {
    type: String,
    enum: ["none", "pending", "approved", "rejected"],
    default: "none"
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);
