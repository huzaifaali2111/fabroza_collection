import express from "express";
import cookieParser from"cookie-parser";

import moduleRoutes from "./routes/modules.routes.js"; 


// app setting 
const app =  express();
app.use(express.json());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


// routes 
app.use("/api", moduleRoutes);


export default  app;