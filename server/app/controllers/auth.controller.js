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
            profileImage: user.profileImage,
            role: user.role
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
        const { name, email, password, role } = req.body;
        const user = await authService.register({ name, email, password, role });

        // HTML Body
        const message = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 1000px; margin: 0 auto; padding: 10px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
            <div style="background-color: #0377bfff; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">My Store</h1>
            </div>
            
            <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hi,</p>
                
                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 25px;">
                  Welcome to <strong>My Store</strong>! To complete your registration and verify your email address, please use the One-Time Password (OTP) below.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: rgb(20, 113, 184); background-color: #eff6ff; padding: 15px 30px; border-radius: 8px; border: 1px dashed rgb(150, 154, 164);">
                    ${user.otp}
                  </span>
                </div>
                
                <p style="font-size: 14px; color: #6b7280; text-align: center; margin-bottom: 30px;">
                  This OTP is valid for <strong>3 minutes</strong>. Please do not share this code with anyone.
                </p>
                
                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                
                <div style="text-align: center;">
                    <p style="font-size: 14px; color: #374151; margin-bottom: 5px; font-weight: bold;">Best Regards,</p>
                    <p style="font-size: 16px; color: rgb(25, 146, 202); font-weight: bold; margin: 0;">Subhradeep Nath</p>
                    <p style="font-size: 12px; color: #6b7280; margin-top: 2px;">App Developer</p>
                     <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
                        &copy; ${new Date().getFullYear()} My Store. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: "Account Verification OTP",
                html: message,
            });

            res.status(200).json({
                success: true,
                data: `OTP sent to ${user.email}`,
            });
        } catch (err) {
            console.log(err);
            // We could delete the user here if email fails
            return next(new ErrorResponse("Email could not be sent", 500));
        }
    } catch (err) {
        console.error("Register Error:", err);
        next(err);
    }
};


exports.verifyEmail = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const user = await authService.verifyEmail(email, otp);

        res.status(200).json({
            success: true,
            data: "Email verified successfully. Please login."
        });
    } catch (err) {
        next(err);
    }
};


exports.resendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await authService.resendOtp(email);

        // HTML Body
        const message = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
            <div style="background-color: rgba(25, 132, 207, 1); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Product Manager</h1>
            </div>
            
            <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hi,</p>
                
                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 25px;">
                  Here is your new OTP. Please use it to complete your Sign Up procedures.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: rgba(27, 149, 220, 1); background-color: #eff6ff; padding: 15px 30px; border-radius: 8px; border: 1px dashed rgba(133, 148, 156, 1);">
                    ${user.otp}
                  </span>
                </div>
                
                <p style="font-size: 14px; color: #6b7280; text-align: center; margin-bottom: 30px;">
                  This OTP is valid for <strong>3 minutes</strong>. Please do not share this code with anyone.
                </p>
                
                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                
                <div style="text-align: center;">
                    <p style="font-size: 14px; color: #374151; margin-bottom: 5px; font-weight: bold;">Best Regards,</p>
                    <p style="font-size: 16px; color: rgba(32, 141, 215, 1); font-weight: bold; margin: 0;">Subhradeep Nath</p>
                    <p style="font-size: 12px; color: #6b7280; margin-top: 2px;">App Developer</p>
                     <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
                        &copy; ${new Date().getFullYear()} Product Manager. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: "Account Verification OTP (Resend)",
                html: message,
            });

            res.status(200).json({
                success: true,
                data: `OTP resent to ${user.email}`,
            });
        } catch (err) {
            return next(new ErrorResponse("Email could not be sent", 500));
        }

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

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const { user, resetToken } = await authService.forgotPassword(email);

        // Create reset url
        // In local, typically http://localhost:5173/reset-password/:token
        // Assuming CLIENT_URL is defined or defaulting to local Vite port
        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

        const message = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
            <div style="background-color: rgba(21, 147, 211, 1); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">My Store</h1>
            </div>
            
            <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hi,</p>
                
                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 10px;">
                  You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to:
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: hsla(198, 78%, 46%, 1.00); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Reset Password</a>
                </div>

                <p style="font-size: 14px; color: #6b7280; text-align: center; margin-bottom: 30px;">
                    This link will expire in 10 minutes. If you did not request this, please ignore this email.
                </p>
                
                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                
                <div style="text-align: center;">
                    <p style="font-size: 14px; color: #374151; margin-bottom: 5px; font-weight: bold;">Best Regards,</p>
                    <p style="font-size: 16px; color: #2592ebff; font-weight: bold; margin: 0;">Subhradeep Nath</p>
                    <p style="font-size: 12px; color: #6b7280; margin-top: 2px;">App Developer</p>
                     <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
                        &copy; ${new Date().getFullYear()} Product Manager. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset Request",
                html: message,
            });

            res.status(200).json({ success: true, data: "Email sent" });
        } catch (err) {
            console.log(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return next(new ErrorResponse("Email could not be sent", 500));
        }

    } catch (err) {
        next(err);
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        const resetToken = req.params.resettoken;

        const user = await authService.resetPassword(resetToken, password);

        sendTokenResponse(user, 200, res);

    } catch (err) {
        next(err);
    }
};
