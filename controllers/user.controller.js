const User = require("../models/User");

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({
            message: "Users fetched successfully",
            users
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get current logged-in user profile
exports.getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "My Profile",
            profile: user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get another user profile by ID
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User Profile",
            profile: user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}