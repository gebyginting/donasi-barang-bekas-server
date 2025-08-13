const express = require("express");
const { createDonation, getDonations, getMyDonations, updateDonation, deleteDonation, getDonationById } = require("../controllers/donation.controller");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Create donation (dengan upload gambar)
router.post("/", protect, authorize("donatur"), upload.single("image"), createDonation);

// Get all donations
router.get("/", getDonations);

// Get All donasi of a donor
router.get("/my", protect, authorize("donatur"), getMyDonations);

// Get detail donation
router.get("/:id", getDonationById);

// Update donation (for donor)
router.put("/:id", protect, authorize("donatur"), upload.single("image"), updateDonation);

// Delete donation (hanya donatur yang buat)
router.delete("/:id", protect, authorize("donatur"), deleteDonation);

module.exports = router;