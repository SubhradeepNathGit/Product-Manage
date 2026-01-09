const userService = require("../services/user.service");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserProfile(req.user.id);
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user details
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email,
        };

        if (req.file) {
            fieldsToUpdate.profileImage = req.file.path;
        }

        const user = await userService.updateUserProfile(req.user.id, fieldsToUpdate);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update password
// @route   PUT /api/users/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
    try {
        await userService.updatePassword(
            req.user.id,
            req.body.currentPassword,
            req.body.newPassword
        );

        res.status(200).json({
            success: true,
            data: {},
            message: "Password updated successfully",
        });
    } catch (err) {
        next(err);
    }
};
