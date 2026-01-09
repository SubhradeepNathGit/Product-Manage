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

const sendEmail = require("../utils/sendEmail");

// ... (sendTokenResponse helper remains here but I need to make sure I don't deleting it. I will target the imports and register function)

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        console.log("Register Request Body:", req.body);
        const user = await authService.register(req.body);

        // Create verification url
        const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${user.verificationToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the creation of an account.\n\nPlease click on the following link to verify your email:\n\n<a href="${verifyUrl}">${verifyUrl}</a>`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Account Verification",
                message,
                html: message.replace(/\n/g, '<br>')
            });

            res.status(200).json({
                success: true,
                data: `Email sent to ${user.email}. Please check your email to verify your account.`
            });
        } catch (err) {
            console.log(err);
            // We could delete the user here if email fails, but for now let's just error
            // await user.remove(); 
            return next(new ErrorResponse("Email could not be sent", 500));
        }
    } catch (err) {
        console.error("Register Error:", err);
        next(err);
    }
};

// @desc    Verify Email
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;
        const user = await authService.verifyEmail(token);
        // After verification, we can either log them in automatically or ask them to login.
        // Let's ask them to login.
        res.status(200).json({
            success: true,
            data: "Email verified successfully. Please login."
        });
    } catch (err) {
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
