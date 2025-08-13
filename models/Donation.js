const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    location: { type: String, required: true },
    condition: { type: String, enum: ["baru", "bekas"], required: true },
    category: { type: String, enum: ["pakaian", "makanan", "uang", "lainnya"], required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Donation", donationSchema);