import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  time: {
    type: String,
    required: true
  },
  location: { 
    type: String, 
    required: true 
  },
  organizer: { 
    type: String, 
    required: true 
  },
  contactEmail: { 
    type: String, 
    required: true 
  },
  contactPhone: {
    type: String,
    required: false
  },
  maxParticipants: {
    type: Number,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  category: {
    type: String,
    enum: ["Cleaning Drive", "Tree Plantation", "Awareness Camp", "Recycling", "Wildlife", "Other"],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed", "cancelled"],
    default: "upcoming"
  }
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);