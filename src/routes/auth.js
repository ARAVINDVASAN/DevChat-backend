const express=require("express");
const {validateSignUpData} =require("../utils/validation");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User = require("../models/user"); 
const {userAuth}=require("../middlewares/auth");
const authRouter=express.Router();
authRouter.post("/signup", async (req, res) => {
   
    try {
        validateSignUpData(req);//validation
        const{firstName,lastName,emailId,password,age,gender}=req.body;
        //encrypt the password with hash
        const passwordHash=await bcrypt.hash(password,10);
        
        const newUser = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash,age,gender
        });
        await newUser.save();
        res.send("Data saved successfully");
    } catch (err) {
        res.status(400).send("Error saving the user: " + err.message);
    }
});
authRouter.post("/login",async(req,res)=>{
    try{
        const{emailId,password}=req.body;
        const user=await User.findOne({emailId:emailId});
        if(!user)
        {
            throw new Error("Email id is not present");
        }
        const ispasswordvalid=bcrypt.compare(password,user.password);
        if(ispasswordvalid)
        {  
            const token=await jwt.sign({_id:user._id},"devchat33$",{expiresIn:"1d"});
            
            res.cookie("token",token,{expires:new Date(Date.now()+6*3600000),});
            res.send("login successfull");
        }
        else{
            throw new Error("Password is not valid");
        }
    }

    catch (err) {
        res.status(400).send("Error saving the user: " + err.message);
    }

});


authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.send("LOGOUT SUCCESSFULL!!!!!!!!!");


})

module.exports=authRouter;  