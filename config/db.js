const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect(ProcessingInstruction.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
        processs.exit(1);
    }
};

module.exports = connectDb;