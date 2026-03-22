const mongoose = require("mongoose");

function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  return mongoose.connect(mongoUri);
}

module.exports = { connectDB };

