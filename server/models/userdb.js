const mongoose = require("mongoose");
const { Schema, model, models } = mongoose;

const userSchema = new Schema({
    clerkId: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true 
    },
    name: {
        type: String,
        required: true
    },
}, { timestamps: true });

const UserModel = models.UserDB || model('UserDB', userSchema);

module.exports = UserModel;