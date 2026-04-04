import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', verifyToken, isAdmin, getAdminStats);

export default router;
