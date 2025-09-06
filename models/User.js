const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// bikin dulu profileSchema
const profileSchema = new mongoose.Schema({
  city: { type: String },
  verified: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },

  stats: {
    totalDonations: { type: Number, default: 0 },
    totalReceived: { type: Number, default: 0 },
    totalCampaigns: { type: Number, default: 0 },
    totalConnections: { type: Number, default: 0 }
  },

  lastActivities: [{
    type: {
      type: String,
      enum: ["donation", "request"]
    },
    item: String,
    status: String,
    date: { type: Date, default: Date.now }
  }]
}, { _id: false }); // _id: false supaya subdocument ga bikin _id sendiri

// baru bikin userSchema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["donatur", "receiver", "admin"], default: "receiver" },

  detail: { type: profileSchema, default: {} }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
