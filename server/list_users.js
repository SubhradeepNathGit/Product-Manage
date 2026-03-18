const mongoose = require("mongoose");
const User = require("./app/models/User");
require("dotenv").config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB\n");

        const users = await User.find({}).select('name email role');

        console.log(`Found ${users.length} users:\n`);
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role || 'NOT SET'}`);
        });

        mongoose.connection.close();
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
};

listUsers();
