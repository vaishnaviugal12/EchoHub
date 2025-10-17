import express from "express";
import { getGdeltNews, getNewsDataNews } from "../controller/newsController.js";

const router = express.Router();

// Routes
router.get("/gdelt", getGdeltNews);
router.get("/newsdata", getNewsDataNews);

export default router;
