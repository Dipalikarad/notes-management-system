const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    content: { type: String, default: "", maxlength: 5000 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

// Speed up dashboards (userId + createdAt sorting)
noteSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Note", noteSchema);

