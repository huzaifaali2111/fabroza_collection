import express from "express";
import authController from "./auth.controller.js";
import userValidation from "./auth.validation.js";
import validate from "../../core/middleware/validation.middleware.js";
const router = express.Router();


// signup 
router.post("/signup",validate(userValidation)authController.userSignup);

// login 
router.post("/login", (req, res) => {
    res.json({
        message: "Login route",
    });
});


export default router;