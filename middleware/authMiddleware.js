const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
    let token;

    // Ambil token dari header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Tidak ada token, akses ditolak" });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ambil data user dari DB (tanpa password)
        req.user = await User.findById(decoded.id).select("-password");

        next();
    } catch (error) {
        res.status(401).json({ message: "Token tidak valid" });
    }
};

// Middleware untuk cek role
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Akses ditolak" });
        }
        next();
    };
};
