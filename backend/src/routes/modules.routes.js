import express from 'express';


// Importing modules routes 
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js"
import adminProducROutes from "../modules/product/product.admin.routes.js"


// set router to export all in one  
const router = express.Router();

// using routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminProducROutes);



export default router;