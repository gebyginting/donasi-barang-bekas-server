const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  condition: String,
  location: String,
  imageUrl: String,
  status: { type: String, enum: ["available", "taken"], default: "available" },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Donation", donationSchema);