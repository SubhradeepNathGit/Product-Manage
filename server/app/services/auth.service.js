const crypto = require("crypto");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// Register user
exports.register = async (userData) => {
    const { name, email, password } = userData;

    const verificationToken = crypto.randomBytes(20).toString("hex");

    const user = await User.create({
        name,
        email,
        password,
        verificationToken,
        isVerified: false,
    });

    return user;
};

// Login user
exports.login = async (email, password) => {
    if (!email || !password) {
        throw new ErrorResponse("Please provide an email and password", 400);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ErrorResponse("Invalid credentials", 401);
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        throw new ErrorResponse("Invalid credentials", 401);
    }

    if (!user.isVerified) {
        throw new ErrorResponse("Please verify your email to login", 401);
    }

    return user;
};

// Verify Email
exports.verifyEmail = async (token) => {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
        throw new ErrorResponse("Invalid verification token", 400);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return user;
};

// Update refresh token
exports.updateRefreshToken = async (userId, refreshToken) => {
    await User.findByIdAndUpdate(userId, { refreshToken });
};

// Clear refresh token
exports.logout = async (userId) => {
    await User.findByIdAndUpdate(userId, { refreshToken: "" });
};
