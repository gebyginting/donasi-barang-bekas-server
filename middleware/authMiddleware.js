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
        // cari user berdasarkan id
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User tidak ditemukan" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token tidak valid atau expired" });
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
