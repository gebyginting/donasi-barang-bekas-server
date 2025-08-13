const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/hanya-login", protect, (req, res) => {
    res.json({ message: `Halo ${req.user.name}, ini hanya untuk user login` });
});

router.get("/hanya-admin", protect, authorize("admin"), (req, res) => {
    res.json({ message: "Halo Admin, ini route khusus admin" });
});

module.exports = router;
