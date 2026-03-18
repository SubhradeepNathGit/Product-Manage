const mongoose = require("mongoose");
const User = require("./app/models/User");
require("dotenv").config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const testEmail = `manager_test_${Date.now()}@test.com`;
        console.log("Creating user with email:", testEmail);

        const user = await User.create({
            name: "Test Manager",
            email: testEmail,
            password: "password123",
            role: "manager" // Explicitly setting manager
        });

        console.log("User created:", user);
        console.log("Role stored in DB:", user.role);

        if (user.role !== 'manager') {
            console.error("FAIL: Role mismatch! Expected 'manager', got", user.role);
        } else {
            console.log("PASS: Role stored correctly.");
        }

        await User.findByIdAndDelete(user._id);
        console.log("Cleanup done.");

        mongoose.connection.close();
    } catch (e) {
        console.error("Error:", e);
    }
};

run();
