import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import upload from '../middleware/upload.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/image', verifyToken, isAdmin, upload.single('image'), uploadImage);

export default router;
