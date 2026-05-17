import express from 'express';
const router = express.Router();
import authMiddleware from '../../core/middleware/auth.middleware.js';
import adminMiddleware from '../../core/middleware/admin.middleware.js';


router.post('/add-product', authMiddleware, adminMiddleware, (req, res) => {
    return res.status(200).json({
        message: "product added successfully"
    })
})


export default router;