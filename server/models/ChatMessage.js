// models/ChatMessage.js

const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },

    senderId: {
      type: String,
      required: true,
      index: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000, // production safety
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Compound index for fast room chat fetch
 */
ChatMessageSchema.index({ roomId: 1, createdAt: -1 });

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
