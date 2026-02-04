const productService = require("../services/product.service");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
    try {
        const data = await productService.getProducts(req.query);
        res.status(200).json({
            success: true,
            data: data,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
exports.createProduct = async (req, res, next) => {
    try {
        const productData = {
            ...req.body,
        };
        if (req.file) {
            productData.image = req.file.path;
        }

        const product = await productService.createProduct(productData, req.user.id);
        res.status(201).json({
            success: true,
            data: product,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = async (req, res, next) => {
    try {
        const productData = {
            ...req.body,
        };
        if (req.file) {
            productData.image = req.file.path;
        }

        const product = await productService.updateProduct(req.params.id, req.user.id, productData, req.user.role);
        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res, next) => {
    try {
        const result = await productService.deleteProduct(req.params.id, req.user.id, req.user.role);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Restore product
// @route   PUT /api/products/:id/restore
// @access  Private
exports.restoreProduct = async (req, res, next) => {
    try {
        const result = await productService.restoreProduct(req.params.id, req.user.id, req.user.role);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Force Delete Product
// @route   DELETE /api/products/:id/force
// @access  Private
exports.forceDeleteProduct = async (req, res, next) => {
    try {
        const result = await productService.forceDeleteProduct(req.params.id, req.user.id, req.user.role);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
