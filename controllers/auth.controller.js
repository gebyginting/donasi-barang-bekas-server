const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: 86400 }
    );
};

// Register
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Cek email sudah dipakai?
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email sudah terdaftar "});
        }

        const newUser = await User.create({ name, email, password, role });

        res.status(201).json({
            message: "Register berhasil",
            user: {
                 id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            token: generateToken(newUser)
        });
    } catch (error) {
        res.status(500).json({  message: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
          const { email, password } = req.body;

        // Cek user ada?
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email atau password salah" });
        }

         // Cek password benar?
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email atau password salah" });
        }

          res.json({
            message: "Login berhasil",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: generateToken(user)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};