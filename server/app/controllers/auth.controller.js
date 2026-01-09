const authService = require("../services/auth.service");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper to send token response
const sendTokenResponse = async (user, statusCode, res) => {
    const accessToken = user.getSignedJwtToken();
    const refreshToken = user.getRefreshToken();

    await authService.updateRefreshToken(user._id, refreshToken);

    res.status(statusCode).json({
        success: true,
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage
        }
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        console.log("Register Request Body:", req.body);
        const user = await authService.register(req.body);
        sendTokenResponse(user, 201, res);
    } catch (err) {
        console.error("Register Error:", err);
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await authService.login(email, password);
        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    try {
        await authService.logout(req.user.id);
        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Refresh Token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new ErrorResponse("Refresh token is required", 400));
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return next(new ErrorResponse("Invalid refresh token", 401));
        }

        const newAccessToken = user.getSignedJwtToken();
        const newRefreshToken = user.getRefreshToken();

        await authService.updateRefreshToken(user._id, newRefreshToken);

        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });

    } catch (err) {
        return next(new ErrorResponse("Invalid refresh token", 401));
    }
};
