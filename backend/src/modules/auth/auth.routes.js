import express from "express";
import authController from "./auth.controller.js";
const router = express.Router();


// signup 
router.post("/signup",authController.userSignup);

// login 
router.post("/login", (req, res) => {
    res.json({
        message: "Login route",
    });
});


export default router;