const express = require('express'); 


// Importing modules routes 
const authRoutes = require("../modules/auth/auth.routes");


// set router to export all in one  
const router = express.Router();

// using routes
router.use('/auth', authRoutes);



module.exports = router ;

