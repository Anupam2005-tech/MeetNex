const { Schema, model } = require("mongoose");

const userRegistrationSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
  },
  { timestamps: true }
);
const userModel = model("userDatabase", userRegistrationSchema, "userDB");
module.exports = userModel;
