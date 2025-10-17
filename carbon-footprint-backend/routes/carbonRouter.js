import express from 'express';
import { calculateDailyFootprint,getFootprintHistory,getTodayFootprint } from '../controller/carbonController.js';
import { authMiddleware } from '../middleware/authmiddleware.js'; // Assumes JWT auth

const router = express.Router();

// Record today’s footprint
router.post('/calculate', authMiddleware, calculateDailyFootprint);

// Get historical footprint
router.get('/history', authMiddleware, getFootprintHistory);

// Get today’s footprint
router.get('/today', authMiddleware, getTodayFootprint);

export default router;
