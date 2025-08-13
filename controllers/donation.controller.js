const Donation = require("../models/Donation");
const { uploadToCloudinary, deleteFromCloudinary } = require("../services/cloudinaryService");

// Create donation
const createDonation = async (req, res) => {
    try {

        let imageUrl = null;
        let imagePublicId = null;

       // Upload hanya sekali
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "donations");
            imageUrl = result.secure_url;
            imagePublicId = result.public_id; // simpan id untuk delete kalau gagal
        }

        const donation = await Donation.create({
            ...req.body,
            donor: req.user._id,
            imageUrl,
            imagePublicId
        });

        res.status(201).json({
            success: true,
            message: "Donation created successfully",
            data: donation
        });
    } catch (error) {
        // Hapus gambar di Cloudinary kalau gagal simpan
        if (imagePublicId) {
            await cloudinary.uploader.destroy(imagePublicId);
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

        // Jika ada file baru, upload & hapus lama
        if (req.file) {
            if (donation.imagePublicId) {
                await deleteFromCloudinary(donation.imagePublicId);
            }
            const result = await uploadToCloudinary(req.file.buffer, "donations");
            donation.imageUrl = result.secure_url;
            donation.imagePublicId = result.public_id;
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

          // Hapus gambar dari Cloudinary
        if (donation.imagePublicId) {
            await deleteFromCloudinary(donation.imagePublicId);
        }

        if (donation.donor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this donation" });
        }

        await deleteFromCloudinary(donation.imageUrl);
        await donation.deleteOne();

        res.status(200).json({ success: true, message: "Donation deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createDonation,
    getDonations,
    getMyDonations,
    getDonationById,
    updateDonation,
    deleteDonation
};
