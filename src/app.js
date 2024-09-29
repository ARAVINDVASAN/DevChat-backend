const express = require('express');
const connectDB = require("./config/database");

const app = express();
const cookieParser=require("cookie-parser");
// const jwt=require("jsonwebtoken");
// const User = require("./models/user"); 
// const {validateSignUpData} =require("./utils/validation");
// const bcrypt=require("bcrypt");
// const {userAuth}=require("./middlewares/auth");



app.use(express.json()); //middleware Parse JSON request body
app.use(cookieParser());  //middleware for accessing and reading the cookie

const authRouter=require("../src/routes/auth");
const profileRouter=require("../src/routes/profile");
const requestRouter=require("../src/routes/request");
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);


connectDB().then(() => {
    console.log("Database connection established!!");
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}).catch((err) => {
    console.error("Database not connected:", err.message);
});
 