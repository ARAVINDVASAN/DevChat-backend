const express=require("express");

const  app=express();
app.use("/profile",(req,res)=>{
    res.send("Hi Mathu");
});
app.listen(3000,()=>{
    console.log("Server Runnning");
});

