import express from 'express';
import authMiddleware from '../../core/middleware/auth.middleware.js';
import adminMiddleware from '../../core/middleware/admin.middleware.js';
import dataValidation from '../../core/middleware/validation.middleware.js';
import { createProductSchema } from './product.validation.js';
import productController from './product.controller.js';

const router = express.Router();

router.post('/add-product', authMiddleware, adminMiddleware, dataValidation(createProductSchema), productController.addProduct)


export default router;