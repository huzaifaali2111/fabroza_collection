import express from "express";
import authMiddleware from "../../core/middleware/auth.middleware.js";

const router = express.Router();

router.get("/me",authMiddleware, (req, res) => {
  res.status(200).json({
    user: req.user
  });
});


export default router ;