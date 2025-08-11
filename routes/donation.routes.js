const express = require("express");
const { createDonation } = require("../controllers/donation.controller");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", protect, upload.single("image"), createDonation);

module.exports = router;