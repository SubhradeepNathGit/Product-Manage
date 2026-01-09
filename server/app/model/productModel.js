const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    image: {
      type: String, 
      default: null,
    },

   
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
