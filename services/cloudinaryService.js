const cloudinary = require("../config/cloudinary");

// Upload dari buffer (multer memory storage)
const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(fileBuffer);
    });
};

// Hapus gambar berdasarkan public_id
const deleteFromCloudinary = async (publicId) => {
    return cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
