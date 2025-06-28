const { Schema, model } = require("mongoose");

const ParticipantsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "userDatabase", required: true },
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ["host", "participant"],
    default: "participant",
  },
  joinedAt: { type: Date, default: Date.now },
  leftAt: Date,
});

const meetingSchema = new Schema(
  {
    room_id: {
      type: String,
      required: true,
      unique: true,
    },
    hostId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "userDatabase",
    },
    participants: [ParticipantsSchema],
    status: {
      type: String,
      enum: ["pending", "live", "ended"],
      default: "pending",
    },
    meetingType: {
      type: String,
      enum: ["instant", "scheduled"],
      required: true,
    },
    meetingTitle: {
      type: String,
      required: false,
    },
    shareableLink: {
      type: String,
      required: false, 
    },
    aiSummary: {
      type: String,
      required: false,
    },
    startTime: {
      type: Date
    },
    endTime: {
      type: Date
    },
    recordedURL: {
      type: String
    },
  },
  { timestamps: true }
);

const meetingModel = model("meetingDatabase", meetingSchema, "meetingDatabase");
module.exports = meetingModel;
