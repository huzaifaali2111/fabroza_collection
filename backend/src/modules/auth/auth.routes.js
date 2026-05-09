const express = require('express');
const router = express.Router();


// signup 
router.post("/signup", (req, res) => {
    res.json({
        message: "Login route",
    });
});

// login 
router.post("/login", (req, res) => {
    res.json({
        message: "Login route",
    });
});


module.exports = router
