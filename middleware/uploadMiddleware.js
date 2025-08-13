const multer = require("multer");

// Memory storage, file langsung ke RAM
const storage = multer.memoryStorage();

// Filter hanya gambar
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Hanya file gambar yang diizinkan!"), false);
    }
};

// Batas ukuran 2MB
const limits = { fileSize: 2 * 1024 * 1024 };

module.exports = multer({ storage, fileFilter, limits });
