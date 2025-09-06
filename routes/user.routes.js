const express = require("express");
const router = express.Router();
const { getAllUsers, getUserProfile, getMyProfile } = require("../controllers/user.controller");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getAllUsers);
router.get("/myProfile", protect, getMyProfile);
router.get("/:id", protect, authorize("admin", "donatur", "receiver"), getUserProfile);


module.exports = router;