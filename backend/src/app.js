const  express = require('express');
const cookieParser = require("cookie-parser")

const moduleRoutes = require('./routes/modules.routes'); 


// app setting 
const app =  express();
app.use(express.json());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


// routes 

app.use("/api", moduleRoutes);

module.exports = app 