// src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const jwtkey=process.env.JWT_KEY
const userAuth = async (req, res, next) => {
    try {

            const token = req.cookies.token;


        // If there is no token, the user is not authenticated.
        // This is why a 401 Unauthorized response is returned.
        if (!token) {
            return res.status(401).json({ message: "Please login to continue." }); // 401 Unauthorized
        }

        // Verify the token
        const decoded = jwt.verify(token,jwtkey); // Replace with environment variable in production
     
        const { _id } = decoded;
        // Find the user by ID
        const user = await User.findById(_id);
        if (!user) {
            console.error("User not found with ID:", _id);
            return res.status(401).json({ message: "Invalid credentials." }); // 401 Unauthorized
        }

        // Attach user to request object
        req.user = user;
        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.error("Authentication error:", err.message);
        return res.status(401).json({ message: "Authentication failed: " + err.message }); // 401 Unauthorized
    }
};

module.exports = {
    userAuth
};
