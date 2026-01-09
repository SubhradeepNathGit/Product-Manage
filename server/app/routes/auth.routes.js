const express = require("express");
const {
    register,
    login,
    verifyEmail,
    logout,
    getMe,
    refreshToken,
} = require("../controllers/auth.controller");

const { protect } = require("../middleware/auth");

const { registerValidation, loginValidation } = require("../middleware/validators");

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/verify-email", verifyEmail);
router.post("/login", loginValidation, login);
router.get("/logout", protect, logout);
router.get("/me", protect, getMe);
router.post("/refresh", refreshToken);

module.exports = router;
