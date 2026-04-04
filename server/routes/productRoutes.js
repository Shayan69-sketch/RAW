import express from 'express';
import {
  getProducts, getProductBySlug, createProduct,
  updateProduct, deleteProduct, uploadProductImages,
} from '../controllers/productController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', verifyToken, isAdmin, createProduct);
router.put('/:id', verifyToken, isAdmin, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);
router.post('/:id/images', verifyToken, isAdmin, uploadProductImages);

export default router;
