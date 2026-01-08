const mongoose = require("mongoose");

const botChatSchema = mongoose.Schema(
  {
    title: String,
    thread: String,
    messages: [
      {
        message: String,
        reply: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("botChats", botChatSchema);
