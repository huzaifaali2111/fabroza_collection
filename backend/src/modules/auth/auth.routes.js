import express from "express";
import authController from "./auth.controller.js";
import userValidation from "./auth.validation.js";
import validate from "../../core/middleware/validation.middleware.js";
const router = express.Router();


// signup 
router.post("/signup",validate(userValidation.signupValidation), authController.userSignup);

// login 
router.post("/login", validate(userValidation.loginValidation), authController.userlogin);

// refresh token 
router.post("/refresh", authController.refreshToken)

// logout
router.post("/logout", authController.logout)


export default router;