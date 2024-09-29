const express=require('express');
const {userAuth}=require("../middlewares/auth");
const { validateSignUpData, validateEditprofileData } = require('../utils/validation');
const profileRouter=express.Router();

profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
    const user=req.user;
    res.send(user);
    console.log(user);
    }

    catch (err) {
        res.status(400).send("Error saving the user: " + err.message);
    }

});

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>
{
    try{
        if(!validateEditprofileData(req))
        {
            throw new Error("Invalid edit request");
        }
        const loggedinuser=req.user;
        Object.keys(req.body).forEach((key)=>(loggedinuser[key]=req.body[key]));
        await loggedinuser.save();
        res.send("profile updated successfully");

    }
    catch(err)
    {
        res.status(400).send("Error : " + err.message);
    }
});
module.exports=profileRouter;