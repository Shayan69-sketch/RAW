import express from 'express';
import {
  getProductReviews, createReview, updateReview,
  deleteReview, approveReview,
} from '../controllers/reviewController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', verifyToken, createReview);
router.put('/:id', verifyToken, updateReview);
router.delete('/:id', verifyToken, deleteReview);
router.put('/:id/approve', verifyToken, isAdmin, approveReview);

export default router;
