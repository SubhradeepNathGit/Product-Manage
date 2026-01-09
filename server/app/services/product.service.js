const Product = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");
const cloudinary = require("../config/cloudinary");

// Create Product
exports.createProduct = async (productData, userId) => {
    const product = await Product.create({
        ...productData,
        createdBy: userId,
    });
    return product;
};

// Get All Products (with Pagination & Search & Soft Delete check)
exports.getProducts = async (query) => {
    const { page = 1, limit = 10, search = "", category = "", userId = "", isDeleted } = query;

    const filter = {
        isDeleted: isDeleted === "true",
    };

    if (search) {
        filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
        filter.category = category;
    }

    if (userId) {
        filter.createdBy = userId;
    }

    const products = await Product.find(filter)
        .populate("createdBy", "name email")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const count = await Product.countDocuments(filter);

    return {
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
        totalProducts: count,
    };
};

// Get Single Product
exports.getProductById = async (productId) => {
    const product = await Product.findOne({ _id: productId }).populate(
        "createdBy",
        "name email"
    );

    if (!product) {
        throw new ErrorResponse("Product not found", 404);
    }

    return product;
};

// Update Product
exports.updateProduct = async (productId, userId, updateData) => {
    let product = await Product.findById(productId);

    if (!product || product.isDeleted) {
        throw new ErrorResponse("Product not found", 404);
    }

    // Check ownership
    // Logic update: If product has no owner (legacy), allow update and adopt it
    if (product.createdBy && product.createdBy.toString() !== userId) {
        throw new ErrorResponse("Not authorized to update this product", 401);
    }

    // If legacy product (no createdBy), assign current user as owner
    if (!product.createdBy) {
        updateData.createdBy = userId;
    }

    // Delete old image from Cloudinary if new image is uploaded
    if (updateData.image && product.image && product.image !== "no-photo.jpg") {
        try {
            // Extract public_id from URL
            const parts = product.image.split("product-listing/");
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
            // Non-blocking: continue with update even if delete fails
        }
    }

    product = await Product.findByIdAndUpdate(productId, updateData, {
        new: true,
        runValidators: true,
    });

    return product;
};

// Soft Delete Product
exports.deleteProduct = async (productId, userId) => {
    const product = await Product.findById(productId);

    if (!product || product.isDeleted) {
        throw new ErrorResponse("Product not found", 404);
    }

    // Check ownership
    console.log(`[DeleteProduct] ProductID: ${productId}, UserID: ${userId}, Creator: ${product.createdBy}`);
    if (product.createdBy && product.createdBy.toString() !== userId) {
        throw new ErrorResponse("Not authorized to delete this product", 401);
    }

    // Legacy support: If no owner, allow deletion (effectively "claiming" responsibility)

    product.isDeleted = true;
    await product.save();

    return { message: "Product deleted successfully" };
};

// Restore Product
exports.restoreProduct = async (productId, userId) => {
    // We need to find even deleted ones
    const product = await Product.findById(productId);

    if (!product) {
        throw new ErrorResponse("Product not found", 404);
    }

    // Check ownership
    if (product.createdBy && product.createdBy.toString() !== userId) {
        throw new ErrorResponse("Not authorized to restore this product", 401);
    }

    product.isDeleted = false;
    // If it was a legacy product, let's assign it to the restorer
    if (!product.createdBy) {
        product.createdBy = userId;
    }

    await product.save();

    return { message: "Product restored successfully" };
};

// Force Delete Product (Permanent)
exports.forceDeleteProduct = async (productId, userId) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ErrorResponse("Product not found", 404);
    }

    // Check ownership
    console.log(`[ForceDelete] ProductID: ${productId}, UserID: ${userId}, Creator: ${product.createdBy}`);
    if (product.createdBy && product.createdBy.toString() !== userId) {
        throw new ErrorResponse("Not authorized to delete this product", 401);
    }

    // Delete image from Cloudinary
    if (product.image && product.image !== "no-photo.jpg") {
        try {
            // Extract public_id from URL
            const parts = product.image.split("product-listing/");
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

    await Product.findByIdAndDelete(productId);

    return { message: "Product permanently deleted" };
};
