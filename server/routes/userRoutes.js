import express from 'express';
import {
  updateProfile, updatePassword,
  addAddress, updateAddress, deleteAddress,
  getWishlist, addToWishlist, removeFromWishlist,
  getAllUsers, getUserById, toggleUserBan,
} from '../controllers/userController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes
router.get('/', verifyToken, isAdmin, getAllUsers);
router.get('/:id', verifyToken, isAdmin, getUserById);
router.put('/:id/toggle-ban', verifyToken, isAdmin, toggleUserBan);

// Profile routes
router.put('/profile', verifyToken, updateProfile);
router.put('/password', verifyToken, updatePassword);

// Address routes
router.post('/address', verifyToken, addAddress);
router.put('/address/:id', verifyToken, updateAddress);
router.delete('/address/:id', verifyToken, deleteAddress);

// Wishlist routes
router.get('/wishlist', verifyToken, getWishlist);
router.post('/wishlist/:productId', verifyToken, addToWishlist);
router.delete('/wishlist/:productId', verifyToken, removeFromWishlist);

export default router;
