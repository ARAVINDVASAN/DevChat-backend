const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http=require("http");
const intialSockett=require("./utils/socket");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allows cookies to be sent from the frontend
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], // Allow PATCH and other methods
  })
);

// Explicitly handle preflight requests for all routes
app.options("*", cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
}));

app.use(express.json());
app.use(cookieParser()); // Parses cookies from incoming requests
require("dotenv").config();
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter=require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/",chatRouter);
const server=http.createServer(app);

intialSockett(server);
connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(7000, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });