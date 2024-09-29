const jwt=require('jsonwebtoken')
const User=require("../models/user")
const userAuth=async(req,res,next)=>
{   try{
      //read the token from the req cookies
      const {token}=req.cookies;
      if(!token)
        {
            throw new Error("INVALID TOKEN:!!!");
        }

      const decoded=await jwt.verify(token,"devchat33$");
      const {_id}=decoded;
      const user=await User.findById(_id);
      if(!user)
        {
            throw new Error("INVALID CREDENTIALS:!!!");
        }
        req.user = user;
        next();}
        catch (err) {
            res.status(400).send("Error saving the user: " + err.message);
        }

};

module.exports={
    userAuth
};