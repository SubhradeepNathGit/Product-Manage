const Product = require("../model/productModel");
const fs = require("fs");
const path = require("path");

class ProductApiController {

  // 1. CREATE PRODUCT
  async createProduct(req, res) {
    try {
      const { name, description, price, category, inStock } = req.body;

      const image = req.file ? req.file.filename : null;

      const productData = new Product({
        name,
        description,
        price,
        category,
        inStock,
        image,
      });

      const data = await productData.save();

      return res.status(201).json({
        status: true,
        message: "Product created successfully!",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }


  // 2. GET ALL PRODUCTS
  async getAllProducts(req, res) {
    try {
      const { search, category, sort, page, limit } = req.query;

      const query = {};

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      if (category) {
        query.category = category;
      }

      const pageNumber = Number(page) || 1;
      const limitNumber = Number(limit) || 10;
      const skip = (pageNumber - 1) * limitNumber;

      let mongoQuery = Product.find(query);

      if (sort) {
        if (sort === "price_low") mongoQuery = mongoQuery.sort({ price: 1 });
        if (sort === "price_high") mongoQuery = mongoQuery.sort({ price: -1 });
        if (sort === "newest") mongoQuery = mongoQuery.sort({ createdAt: -1 });
      }

      const data = await mongoQuery.skip(skip).limit(limitNumber);
      const totalProducts = await Product.countDocuments(query);

      return res.status(200).json({
        status: true,
        results: data.length,
        totalProducts,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalProducts / limitNumber),
        data,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }


  // 3. GET SINGLE PRODUCT
  async getProduct(req, res) {
    try {
      const id = req.params.id;
      const data = await Product.findById(id);

      if (!data) {
        return res.status(404).json({
          status: false,
          message: "Product not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Product fetched successfully",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }


  // 4. UPDATE PRODUCT + DELETE OLD IMAGE
  async updateProduct(req, res) {
    try {
      const id = req.params.id;

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({
          status: false,
          message: "Product not found for update",
        });
      }

      // If new image uploaded → delete old image
      if (req.file) {
        const oldImagePath = path.join(__dirname, "../uploads", product.image);

        if (product.image && fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        product.image = req.file.filename;
      }

      // Update other fields
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.category = req.body.category || product.category;
      product.inStock = req.body.inStock || product.inStock;

      const updatedProduct = await product.save();

      return res.status(200).json({
        status: true,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }


  // 5. DELETE PRODUCT + DELETE IMAGE
  async deleteProduct(req, res) {
    try {
      const id = req.params.id;

      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        return res.status(404).json({
          status: false,
          message: "Product not found for deletion",
        });
      }

      // Delete the image file
      if (product.image) {
        const oldImagePath = path.join(__dirname, "../uploads", product.image);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      return res.status(200).json({
        status: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ProductApiController();
