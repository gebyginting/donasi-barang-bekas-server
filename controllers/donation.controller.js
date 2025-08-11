const Donation = require("../models/Donation");

exports.createDonation = async (req, res) => {
  try {
    const donation = await Donation.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      condition: req.body.condition,
      location: req.body.location,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
      donor: req.user._id
    });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
