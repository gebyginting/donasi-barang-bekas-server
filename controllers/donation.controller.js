const mongoose = require("mongoose");
const Donation = require("../models/Donation");
const { uploadToCloudinary, deleteFromCloudinary } = require("../services/cloudinaryService");

// Create donation
const createDonation = async (req, res) => {
    let imageUrls = [];
    let imagePublicIds = [];
    try {
        // Kalau multiple files diupload
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer, "donations");
                imageUrls.push(result.secure_url);
                imagePublicIds.push(result.public_id);
            }
        }

        const user = req.user;

        const donation = await Donation.create({
            ...req.body,
            donor: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            imageUrl: imageUrls,
            imagePublicId: imagePublicIds
        });

        res.status(201).json({
            success: true,
            message: "Donation created successfully",
            data: donation
        });
    } catch (error) {
        // Kalau gagal dan ada imagePublicIds, hapus semua dari Cloudinary
        if (imagePublicIds.length > 0) {
            for (const id of imagePublicIds) {
                await deleteFromCloudinary(id);
            }
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all donations (with pagination & filter)
const getDonations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};

        // Filter by category / location / condition
        if (req.query.category) query.category = req.query.category;
        if (req.query.location) query.location = { $regex: req.query.location, $options: "i" };
        if (req.query.condition) query.condition = req.query.condition;

        // Search by text qurey (name + location + donor)
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }

        const totalItems = await Donation.countDocuments(query);

        const donations = await Donation.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            data: donations
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// get donations by userId
const getDonationsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validasi ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid userId",
            });
        }

        const donations = await Donation.find({ donor: new mongoose.Types.ObjectId(userId) })
            .populate("donor", "username email")
            .sort({ date: -1 });

        if (!donations || donations.length === 0) {
            return res.status(404).json({ message: userId });
        }
        console.log(userId);

        res.status(200).json({
            success: true,
            data: donations,
            total: donations.length,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get my donations
const getMyDonations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { donor: req.user.id };
        if (req.query.category) query.category = req.query.category;
        if (req.query.location) query.location = { $regex: req.query.location, $options: "i" };
        if (req.query.condition) query.condition = req.query.condition;

        const totalItems = await Donation.countDocuments(query);
        const donations = await Donation.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            data: donations
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get donation by ID
const getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id)
            .populate("donor", "-password");

        if (!donation) {
            return res.status(404).json({ success: false, message: "Donation not found" });
        }

        const isOwner = req.user && donation.donor && donation.donor._id.toString() === req.user.id;

        res.status(200).json({ success: true, isOwner, data: donation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update donation
const updateDonation = async (req, res) => {
    try {
        const donation = await Donation.findOne({
            _id: req.params.id,
            donor: req.user.id
        });

        if (!donation) {
            return res.status(404).json({ success: false, message: "Donation not found" });
        }

        const { name, description, amount, location, condition, category } = req.body;
        if (name) donation.name = name;
        if (description) donation.description = description;
        if (amount) donation.amount = amount;
        if (location) donation.location = location;
        if (condition) donation.condition = condition;
        if (category) donation.category = category;

        // Jika ada file baru → hapus semua gambar lama & upload yang baru
        if (req.files && req.files.length > 0) {
            // hapus semua gambar lama dari Cloudinary
            if (donation.imagePublicId && donation.imagePublicId.length > 0) {
                for (const id of donation.imagePublicId) {
                    await deleteFromCloudinary(id);
                }
            }

            let newImageUrls = [];
            let newImagePublicIds = [];

            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer, "donations");
                newImageUrls.push(result.secure_url);
                newImagePublicIds.push(result.public_id);
            }

            donation.imageUrl = newImageUrls;
            donation.imagePublicId = newImagePublicIds;
        }

        await donation.save();

        res.status(200).json({ success: true, message: "Donation updated successfully", data: donation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete donation
const deleteDonation = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({ success: false, message: "Donation not found" });
        }

        if (donation.donor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this donation" });
        }

        // Hapus semua gambar dari Cloudinary
        if (donation.imagePublicId && donation.imagePublicId.length > 0) {
            for (const id of donation.imagePublicId) {
                await deleteFromCloudinary(id);
            }
        }

        await donation.deleteOne();

        res.status(200).json({ success: true, message: "Donation deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {
    createDonation,
    getDonations,
    getDonationsByUserId,
    getMyDonations,
    getDonationById,
    updateDonation,
    deleteDonation
};
