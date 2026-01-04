const express = require("express");
require("dotenv").config();

const DbConnection = require("./config/db");
const clerkRoutes = require("./routes/userAuthRoutes");
const configureMiddleware = require("./middleware/auth"); 
const PORT = process.env.PORT || 5000;

const app = express();

configureMiddleware(app);

DbConnection();

app.use("/user", clerkRoutes);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});