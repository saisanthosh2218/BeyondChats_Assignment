const mongoose = require("mongoose");

const chatbotSchema = new mongoose.Schema({
  website: { type: String, required: true },
  integrated: { type: Boolean, default: false },
});

module.exports = mongoose.model("Chatbot", chatbotSchema);
