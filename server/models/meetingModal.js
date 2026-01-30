const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    hostId: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["P2P", "SFU"],
      required: true,
    },

    visibility: {
      type: String,
      enum: ["PRIVATE", "OPEN"],
      default: "PRIVATE",
    },

    allowedUsers: [
      {
        type: String,
      },
    ],

    maxParticipants: {
      type: Number,
      default: 2, // P2P default
    },

    participants: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["CREATED", "LIVE", "ENDED"],
      default: "CREATED",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);
