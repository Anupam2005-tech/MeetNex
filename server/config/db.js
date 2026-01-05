const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGODB_URI ;

const DbConnection = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to atlas:", err);
    process.exit(1);
  }
};

module.exports = DbConnection;