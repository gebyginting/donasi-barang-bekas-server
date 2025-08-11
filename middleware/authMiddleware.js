const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decode.id).select("-password");
            next();
        } catch (err) {
            res.status(401).json*({  message: "Not authorized" });
        }
    } else {
            res.status(401).json({ message: "No token" });
    }
}

module.exports = { protect };