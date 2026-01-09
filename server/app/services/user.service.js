const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const bcrypt = require("bcryptjs");

// Get user profile
exports.getUserProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ErrorResponse("User not found", 404);
    }
    return user;
};

// Update user profile
exports.updateUserProfile = async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    });
    return user;
};

// Update password
exports.updatePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select("+password");

    if (!user) {
        throw new ErrorResponse("User not found", 404);
    }

    if (!(await user.matchPassword(currentPassword))) {
        throw new ErrorResponse("Incorrect current password", 401);
    }

    user.password = newPassword;
    await user.save();
    return user;
};
