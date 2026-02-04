const mongoose = require("mongoose");
const User = require("./app/models/User");
require("dotenv").config();

const updateManagerUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB\n");

        // Find all users with 'manager' in their email
        const users = await User.find({
            email: /manager/i
        });

        if (users.length === 0) {
            console.log("No users with 'manager' in email found.");
            mongoose.connection.close();
            return;
        }

        console.log(`Found ${users.length} user(s) with 'manager' in email:\n`);

        for (const user of users) {
            console.log(`  ${user.email} - Current role: ${user.role}`);

            if (user.role !== 'manager') {
                user.role = 'manager';
                await user.save();
                console.log(`    ✅ Updated to: manager`);
            } else {
                console.log(`    ℹ️  Already a manager`);
            }
        }

        console.log(`\n✅ All manager users updated!`);
        console.log(`\n⚠️  IMPORTANT: Please log out and log back in for changes to take effect.`);

        mongoose.connection.close();
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
};

updateManagerUsers();
