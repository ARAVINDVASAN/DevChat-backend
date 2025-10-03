const express = require("express");
const chatRouter=express.Router();
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");

chatRouter.get("/chat/:targetuserId",userAuth,async(req,res)=>{
    try{
          const userId = req.user._id.toString();

    const targetUserId = req.params.targetuserId;
        console.log("inside chat request",userId,targetUserId)

        let chat=await Chat.findOne({
          participants:{$all:[userId,targetUserId]},
        }).populate({
            path:"messages.senderId",
            select:"firstName lastName photoUrl",
        });
        console.log(chat,"messagess")
        if (!chat)
        {
          chat=new Chat({
            participants:[userId,targetUserId],
            messages:[],
          });
        }
        
        res.json(chat);

    }
    catch(e)
    {

    }
});
module.exports=chatRouter;  