const crypto = require("crypto");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// Register user
exports.register = async (userData) => {
    const { name, email, password } = userData;

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // OTP expires in 3 minutes
    const otpExpire = new Date(Date.now() + 3 * 60 * 1000);

    const user = await User.create({
        name,
        email,
        password,
        role: userData.role || "employee",
        otp,
        otpExpire,
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

    // Check if employee account is active
    if (user.employeeId && !user.isActive) {
        throw new ErrorResponse("Your account has been deactivated. Please contact your administrator.", 401);
    }

    return user;
};

// Verify Email
exports.verifyEmail = async (email, otp) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new ErrorResponse("User not found", 404);
    }

    if (user.isVerified) {
        return user; // Already verified, just return
    }

    if (user.otp !== otp) {
        throw new ErrorResponse("Invalid OTP", 400);
    }

    if (user.otpExpire < Date.now()) {
        throw new ErrorResponse("OTP has expired", 400);
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    return user;
};

// Resend OTP
exports.resendOtp = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new ErrorResponse("User not found", 404);
    }

    if (user.isVerified) {
        throw new ErrorResponse("Email already verified", 400);
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // OTP expires in 3 minutes
    const otpExpire = new Date(Date.now() + 3 * 60 * 1000);

    user.otp = otp;
    user.otpExpire = otpExpire;
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

// Forgot Password
exports.forgotPassword = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new ErrorResponse("There is no user with that email", 404);
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    return { user, resetToken };
};

// Reset Password
exports.resetPassword = async (resetToken, password) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        throw new ErrorResponse("Invalid token", 400);
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return user;
};
