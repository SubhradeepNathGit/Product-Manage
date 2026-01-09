const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a product name"],
            trim: true,
            maxlength: [50, "Name can not be more than 50 characters"],
        },
        description: {
            type: String,
            required: [true, "Please add a description"],
            maxlength: [500, "Description can not be more than 500 characters"],
        },
        price: {
            type: Number,
            required: [true, "Please add a price"],
        },
        category: {
            type: String,
            required: [true, "Please add a category"],
            enum: ["electronics", "fashion", "books", "home", "sports", "toys", "other"],
        },
        inStock: {
            type: Boolean,
            default: true,
        },
        image: {
            type: String,
            default: "no-photo.jpg",
        },
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
