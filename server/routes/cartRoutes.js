import express from 'express';
import {
  getCart, addItem, updateItem, removeItem,
  applyCoupon, removeCoupon,
} from '../controllers/cartController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(optionalAuth);

router.get('/', getCart);
router.post('/items', addItem);
router.put('/items/:itemId', updateItem);
router.delete('/items/:itemId', removeItem);
router.post('/coupon', applyCoupon);
router.delete('/coupon', removeCoupon);

export default router;
