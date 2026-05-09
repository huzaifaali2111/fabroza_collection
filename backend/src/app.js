const  express = require('express');
const moduleRoutes = require('./routes/modules.routes'); 

const app =  express();
app.use(express.json());

app.use("/api", moduleRoutes);

module.exports = app 