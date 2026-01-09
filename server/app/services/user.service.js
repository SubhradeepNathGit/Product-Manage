const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const bcrypt = require("bcryptjs");

const cloudinary = require("../config/cloudinary");

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
    const user = await User.findById(userId);

    if (!user) {
        throw new ErrorResponse("User not found", 404);
    }

    // Delete old image from Cloudinary if new image is uploaded
    if (updateData.profileImage && user.profileImage) {
        try {
            // Extract public_id from URL
            const parts = user.profileImage.split("product-listing/");
            if (parts.length > 1) {
                const afterFolder = parts[1];
                const lastDotIndex = afterFolder.lastIndexOf(".");
                const filename =
                    lastDotIndex !== -1 ? afterFolder.substring(0, lastDotIndex) : afterFolder;
                const publicId = `product-listing/${filename}`;
                await cloudinary.uploader.destroy(publicId);
            }
        } catch (err) {
            console.error("Cloudinary delete error", err);
        }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    });
    return updatedUser;
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
