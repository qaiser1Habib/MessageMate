const express = require("express");

const {
  createChatThread,
  getChatThreads,
  sendMessageInThread,
  deleteChatThread,
} = require("../controllers/botChats.js");

const router = express.Router();

router.get("/", getChatThreads);
router.post("/", createChatThread);
router.delete("/", deleteChatThread);
router.post("/message", sendMessageInThread);

module.exports = router;
