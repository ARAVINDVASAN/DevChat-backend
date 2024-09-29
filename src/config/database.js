const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://aravindvasan33:rTC36BCEwzUHL4Eg@cluster0.kknbc.mongodb.net/Devchat", {
            
        });
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
        // Throw error to be caught in app.js
        throw err;
    }
};

module.exports = connectDB;
