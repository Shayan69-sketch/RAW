import express from 'express';
import {
  createOrder, getAllOrders, getMyOrders,
  getOrderById, updateOrderStatus, cancelOrder,
} from '../controllers/orderController.js';
import { verifyToken, isAdmin, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/', verifyToken, isAdmin, getAllOrders);
router.get('/my-orders', verifyToken, getMyOrders);
router.get('/:id', verifyToken, getOrderById);
router.put('/:id/status', verifyToken, isAdmin, updateOrderStatus);
router.post('/:id/cancel', verifyToken, cancelOrder);

export default router;
