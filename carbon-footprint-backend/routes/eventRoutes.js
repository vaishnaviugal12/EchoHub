import express from "express";
import { createEvent,getEvents,getMyEvents,updateEvent,deleteEvent } from "../controller/eventController.js";
import { authMiddleware } from "../middleware/authmiddleware.js";
import upload from "../config/multer.js"; // For file uploads

const eventRouter = express.Router();

// Public routes
eventRouter.get("/", getEvents);

// Protected routes
eventRouter.post("/", authMiddleware, upload.single("image"), createEvent);
eventRouter.get("/my-events", authMiddleware, getMyEvents);
eventRouter.put("/:id", authMiddleware, updateEvent);
eventRouter.delete("/:id", authMiddleware, deleteEvent);

export default eventRouter;