import express from "express";
import { signup,login,logout,editProfile,getProfile,requestLeader,getLeaderRequests,handleLeaderRequest,getCurrentUser } from "../controller/usercontroller.js";
import { authMiddleware } from "../middleware/authmiddleware.js";
const Userrouter = express.Router();

Userrouter.post("/signup", signup);
Userrouter.post("/login", login);
Userrouter.post("/logout", authMiddleware, logout);
// Protected route
Userrouter.put("/edit", authMiddleware, editProfile);
Userrouter.get('/profile', authMiddleware, getProfile)
Userrouter.get('/me', authMiddleware, getProfile)

// 1️ User sends request to become EcoLeader
Userrouter.post("/leader/request", authMiddleware, requestLeader);

// 2️ Admin fetches all pending requests
Userrouter.get("/leader/requests", authMiddleware, getLeaderRequests);

// 3️ Admin approves or rejects a request
Userrouter.post("/leader/handle", authMiddleware, handleLeaderRequest);



export default Userrouter;
