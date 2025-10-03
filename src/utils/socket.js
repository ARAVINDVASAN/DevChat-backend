const socket = require("socket.io");
const { Chat } = require("../models/chat");

const fetch = require("node-fetch");
const mongoose = require("mongoose");
const AI_BOT_ID = new mongoose.Types.ObjectId("000000000000000000000000");
require("dotenv").config();


const GEMINI_API_KEY=process.env.GEMINI_KEY;
console.log("Loaded GEMINI_KEY:", GEMINI_API_KEY); // Add this line after GEMINI_API_KEY assignment

const initialSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    }
  });

  io.on("connection", (socket) => {
    socket.on("joinchat", ({ userId, targetUserid, firstName }) => {
      const room = [userId, targetUserid].sort().join('_');
      console.log(room, "df", firstName);
      socket.join(room);
    });

    socket.on("sendMessage", async ({ firstName, userId, targetUserid, text }) => {
      const room = [userId, targetUserid].sort().join('_');
      try {
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserid] },
        });
        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserid],
            messages: [],
          });
        }
        chat.messages.push({
          senderId: userId,
          text: text,
          createdAt: new Date()
        });
        await chat.save();

        io.to(room).emit("messageRecieved", { firstName, text, userId });

        if (text.startsWith("@ai")) {
           const prompt = text.replace("@ai", "").trim();
  if (!prompt) {
    io.to(room).emit("messageRecieved", { firstName: "AI-BOT", text: "Please provide a prompt after @ai.", userId: "AI-BOT" });
    return;
  }
    const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    })
  }
);

if (!response.ok) {
  console.error("Gemini API error", await response.text());
  return;
}

const data = await response.json();
// Adjust response parsing based on Gemini API docs
const aiReply =
  data.candidates &&
  data.candidates[0] &&
  data.candidates[0].content &&
  data.candidates[0].content.parts &&
  data.candidates[0].content.parts[0] &&
  data.candidates[0].content.parts[0].text
    ? data.candidates[0].content.parts[0].text
    : "Sorry, I could not generate a response.";


chat.messages.push({
  senderId: AI_BOT_ID,
  text: aiReply,
  createdAt: new Date()
}); 
await chat.save();

io.to(room).emit("messageRecieved", { firstName: "AI-BOT", text: aiReply, userId: "AI-BOT"});
}
      }

      catch (e) {
        console.error("Error in sendMessage:", e);
        // Optionally emit error to client
      }
    });

    socket.on("disconnect", () => {
      // handle cleanup if needed
    });
  });
};

module.exports = initialSocket;
