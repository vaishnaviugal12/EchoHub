import Event from "../models/eventModel.js";
import User from "../models/userModel.js";

// -------- CREATE EVENT (Leaders only) --------
export const createEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if user is a Leader
    const user = await User.findById(userId);
    if (!user || user.role !== "Leader") {
      return res.status(403).json({ 
        message: "Access denied. Only EcoLeaders can create events." 
      });
    }

    const {
      title,
      description,
      date,
      time,
      location,
      organizer,
      contactEmail,
      contactPhone,
      maxParticipants,
      category
    } = req.body;

    // Validate required fields
    if (!title || !description || !date || !time || !location || !organizer || !contactEmail || !category) {
      return res.status(400).json({ 
        message: "All required fields must be filled." 
      });
    }

    // Create event
    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      organizer,
      contactEmail,
      contactPhone,
      maxParticipants,
      category,
      createdBy: userId
    });

    // Handle image upload if present
    if (req.file) {
      event.image = `/uploads/events/${req.file.filename}`;
    }

    await event.save();

    res.status(201).json({
      message: "Event created successfully!",
      event
    });

  } catch (error) {
    console.error("Event creation error:", error);
    res.status(500).json({ message: error.message });
  }
};

// -------- GET ALL EVENTS --------
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "username")
      .sort({ date: 1 }); // Sort by date ascending

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------- GET EVENTS BY LEADER --------
export const getMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const events = await Event.find({ createdBy: userId })
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------- UPDATE EVENT --------
export const updateEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user owns the event or is admin
    const user = await User.findById(userId);
    if (event.createdBy.toString() !== userId && user.role !== "Admin") {
      return res.status(403).json({ 
        message: "Access denied. You can only update your own events." 
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Event updated successfully",
      event: updatedEvent
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------- DELETE EVENT --------
export const deleteEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user owns the event or is admin
    const user = await User.findById(userId);
    if (event.createdBy.toString() !== userId && user.role !== "Admin") {
      return res.status(403).json({ 
        message: "Access denied. You can only delete your own events." 
      });
    }

    await Event.findByIdAndDelete(eventId);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};