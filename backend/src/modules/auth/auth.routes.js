import express from "express";
const router = express.Router();


// signup 
router.post("/signup", (req, res) => {
    res.json({
        message: "Signup route",
    });
});

// login 
router.post("/login", (req, res) => {
    res.json({
        message: "Login route",
    });
});


export default router;