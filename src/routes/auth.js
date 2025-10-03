const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);
    console.log(req.body)
    const { firstName, lastName, emailId, password } = req.body;
    
    // Encrypt the password
    // const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);

    //   Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
authRouter.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
  
      const user = await User.findOne({ emailId: emailId });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" }); // Send response immediately
      }
      console.log(user,'user details teryin got log in ')
      const isPasswordValid = await user.validatePassword(password);
      console.log(isPasswordValid,"12333")
      if (isPasswordValid) {
        const token = await user.getJWT();
  
        // Set the cookie with the token
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
        });
  
        // Send the user data in the response
        return res.json(user); // Use res.json to send JSON response
      } else {
        return res.status(401).json({ message: "Invalid credentials" }); // Send response immediately
      }
    } catch (err) {
      console.error("Login error:", err); // Log the error for debugging
      return res.status(500).json({ message: "Server error" }); // Generic server error response
    }
  });
  

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
});

module.exports = authRouter;