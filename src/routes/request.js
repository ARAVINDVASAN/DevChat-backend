const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require('../models/connectionRequest');  // Ensure the name is capitalized
const User =require('../models/user');
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        console.log("fromUserId:", fromUserId);
        console.log("toUserId:", toUserId);

        // Check if either fromUserId or toUserId is missing
        if (!fromUserId || !toUserId) {
            throw new Error("fromUserId or toUserId is missing");
        }
        const allowedStatus=["ignore","interested"];
        if(!(allowedStatus))
        {
            return res.status(400).send("INvalid status")
        }
        const toUser=await User.findById(toUserId);
        if(!toUser)
        {
            res.status(400).send("user is not availiable")
        }
        const existingConnectionRequest= await ConnectionRequest.findOne({
            $or:[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId}],

        });
        if(existingConnectionRequest){
            return res.status(400).send("already requested");
        }

        // Correct capitalization of the model constructor
        const newConnectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        });

        await newConnectionRequest.save();
        res.send("Request sent successfully!");
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

module.exports = requestRouter;
