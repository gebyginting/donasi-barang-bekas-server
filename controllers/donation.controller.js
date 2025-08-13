const Donation = require("../models/Donation");

// Create donation
const createDonation = async (req, res) => {
    try {
        const { name, description, amount, location, condition, category } = req.body;

        // buat URL gambar dari file yang diupload
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;


        const donation = new Donation({
            donor: req.user.id,
            name,
            description,
            amount,
            imageUrl,
            location,
            condition,
            category
        });

        await donation.save();

        res.status(201).json({
            message: "Donation created successfully",
            data: donation
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all donations (with pagination)
const getDonations = async (req, res) => {
    try {
        // Ambil query params, default page = 1, limit = 10
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Hitung skip (berapa data yg dilewai)
        const skip = (page - 1) * limit;

        // Ambil total data utk hitung total halaman
        const totalItems = await Donation.countDocuments();

        // Ambil data dgn pagination
        const donations = await Donation.find()
        .sort({ createdAt: -1 }) // urut terbaru
        .skip(skip)
        .limit(limit);

               res.status(200).json({
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            data: donations
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all donations of a donor (with pagination)
const getMyDonations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalItems = await Donation.countDocuments({ donor: req.user.id });

        const donations = await Donation.find({ donor: req.user.id })
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
        res.status(500).json({ message: error.message });
    }
};

// Get donation detail by ID + check ownership
const getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id)
            .populate("donor", "-password");
; // Optional: tampilkan info donor

        if (!donation) {
            return res.status(404).json({ message: "Donation not found" });
        }

        // Cek apakah user yang login adalah pemilik donasi
        let isOwner = false;
        if (req.user && donation.donor && donation.donor._id.toString() === req.user.id) {
            isOwner = true;
        }

        res.status(200).json({
            success: true,
            isOwner, // true kalau pemilik, false kalau bukan
            data: donation
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Update donation
const updateDonation = async (req, res) => {
    try {
        const donation = await Donation.findOne({
            _id: req.params.id,
            donor: req.user.id, // biar cuma donatur yg punya data yg bisa update
        });

        if (!donation) {
            return res.status(404).json({ message: "Donation not found" });
        }

        // Update field yang ada di body
        if (req.body.name) donation.name = req.body.name;
        if (req.body.description) donation.description = req.body.description;

        if (req.file) donation.image = req.file.filename;

        const updated = await donation.save();
        res.json(updated);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete donation
const deleteDonation = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({ message: "Donation not found" });
        }

        // Pastikan hanya donatur yang membuat donasi ini yang bisa hapus
        if (donation.donor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this donation" });
        }
        await donation.deleteOne();
        res.status(200).json({ message: "Donation deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

module.exports = { createDonation, getDonations, getMyDonations, getDonationById, updateDonation, deleteDonation };
