const express = require("express");
const { createDonation, getDonations, getDonationsByUserId, getMyDonations, updateDonation, deleteDonation, getDonationById } = require("../controllers/donation.controller");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Create donation (dengan upload gambar)
router.post("/", protect, authorize("donatur"), upload.array("imageUrl", 3), createDonation);

// Get all donations
router.get("/", getDonations);

// Get all donations by UserId
router.get("/:userId", getDonationsByUserId);

// Get All donasi of a donor
router.get("/my", protect, authorize("donatur"), getMyDonations);

// Get detail donation
router.get("/detail/:id", getDonationById);

// Update donation (for donor)
router.put("/:id", protect, authorize("donatur"), upload.single("image"), updateDonation);

// Delete donation (hanya donatur yang buat)
router.delete("/:id", protect, authorize("donatur"), deleteDonation);

module.exports = router;