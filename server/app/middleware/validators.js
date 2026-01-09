const { body, validationResult } = require("express-validator");
const ErrorResponse = require("../utils/errorResponse");

// Middleware to handle validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const message = errors.array().map((err) => err.msg).join(", ");
        return next(new ErrorResponse(message, 400));
    }
    next();
};

// Auth Validations
exports.registerValidation = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    validate,
];

exports.loginValidation = [
    body("email").trim().notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    validate,
];

// Product Validations
exports.productValidation = [
    body("name").trim().notEmpty().withMessage("Product name is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .isIn(["electronics", "fashion", "books", "home", "sports", "toys", "other"])
        .withMessage("Invalid category"),
    validate,
];
