import express from 'express';
const router = express.Router();


router.post('/add-product', (req, res)=>{
    return res.status(200).json({
        message: "product added successfully"
    })
})


export default router;