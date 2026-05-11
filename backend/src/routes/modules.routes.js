import express from'express'; 


// Importing modules routes 
import authRoutes from "../modules/auth/auth.routes.js";


// set router to export all in one  
const router = express.Router();

// using routes
router.use('/auth', authRoutes);



export default router ;