const Product = require('../models/Product');
const Category = require('../models/Category');
const { categorySchema, productSchema } = require('../middleware/validators');
const fs = require('fs');
const path = require('path');

// Dashboard
exports.getDashboard = async (req, res) => {
    try {
        const productsCount = await Product.countDocuments({ isDeleted: false });
        const categoriesCount = await Category.countDocuments({});
        res.render('admin/dashboard', { productsCount, categoriesCount, title: 'Admin Dashboard' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.render('admin/categories/index', { categories, title: 'Manage Categories' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getAddCategory = (req, res) => {
    res.render('admin/categories/add', { title: 'Add Category', errors: null });
};

exports.postAddCategory = async (req, res) => {
    const { error } = categorySchema.validate(req.body);
    if (error) {
        return res.render('admin/categories/add', { title: 'Add Category', errors: error.details });
    }
    try {
        // Check if a category with the same name already exists
        const existing = await Category.findOne({ name: req.body.name });
        if (existing) {
            req.flash('error_msg', 'Category already exists');
            return res.redirect('/admin/categories/add');
        }

        const newCategory = new Category({ name: req.body.name });
        await newCategory.save();
        req.flash('success_msg', 'Category added successfully');
        res.redirect('/admin/categories');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Server Error: Could not add category');
        res.redirect('/admin/categories/add');
    }
};

exports.getEditCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.render('admin/categories/edit', { category, title: 'Edit Category', errors: null });
    } catch (err) {
        res.status(404).send('Category Not Found');
    }
};

exports.postEditCategory = async (req, res) => {
    const { error } = categorySchema.validate(req.body);
    if (error) {
        const category = await Category.findById(req.params.id);
        return res.render('admin/categories/edit', { category, title: 'Edit Category', errors: error.details });
    }
    try {
        const existing = await Category.findOne({ name: req.body.name, _id: { $ne: req.params.id } });
        if (existing) {
            req.flash('error_msg', 'Category name already in use');
            return res.redirect(`/admin/categories/edit/${req.params.id}`);
        }
        const categoryToUpdate = await Category.findById(req.params.id);
        categoryToUpdate.name = req.body.name;
        await categoryToUpdate.save();
        req.flash('success_msg', 'Category updated successfully');
        res.redirect('/admin/categories');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Server Error: Could not update category');
        res.redirect(`/admin/categories/edit/${req.params.id}`);
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Category deleted successfully');
        res.redirect('/admin/categories');
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: false }).populate('category');
        res.render('admin/products/index', { products, title: 'Manage Products' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getAddProduct = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.render('admin/products/add', { categories, title: 'Add Product', errors: null });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.postAddProduct = async (req, res) => {
    // Checkbox conversion before validation
    req.body.inStock = req.body.inStock === 'on' || req.body.inStock === 'true' || req.body.inStock === true;

    const { error } = productSchema.validate(req.body);
    const categories = await Category.find({});

    if (error || !req.file) {
        let errors = error ? error.details : [{ message: 'Image is required' }];
        return res.render('admin/products/add', { categories, title: 'Add Product', errors });
    }

    try {
        const newProduct = new Product({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            inStock: req.body.inStock === 'on' || req.body.inStock === true,
            image: req.file.filename
        });
        await newProduct.save();
        req.flash('success_msg', 'Product added successfully');
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getEditProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const categories = await Category.find({});
        res.render('admin/products/edit', { product, categories, title: 'Edit Product', errors: null });
    } catch (err) {
        res.status(404).send('Product Not Found');
    }
};

exports.postEditProduct = async (req, res) => {
    // Checkbox conversion before validation
    req.body.inStock = req.body.inStock === 'on' || req.body.inStock === 'true' || req.body.inStock === true;

    const { error } = productSchema.validate(req.body);
    const product = await Product.findById(req.params.id);
    const categories = await Category.find({});

    if (error) {
        return res.render('admin/products/edit', { product, categories, title: 'Edit Product', errors: error.details });
    }

    try {
        product.name = req.body.name;
        product.category = req.body.category;
        product.description = req.body.description;
        product.price = req.body.price;
        product.inStock = req.body.inStock === 'on' || req.body.inStock === true;

        if (req.file) {
            // Delete old image if it's not an external URL
            if (product.image && !product.image.startsWith('http')) {
                const oldImagePath = path.join(__dirname, '../../uploads', product.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            product.image = req.file.filename;
        }

        await product.save();
        req.flash('success_msg', 'Product updated successfully');
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product Not Found');

        // Requirement: Delete image file from uploads/ folder
        if (product.image && !product.image.startsWith('http')) {
            const imagePath = path.join(__dirname, '../../uploads', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Soft delete product record
        await Product.findByIdAndUpdate(req.params.id, { isDeleted: true });

        req.flash('success_msg', 'Product deleted successfully');
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Clear All Products
exports.clearAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});

        // Delete all image files from uploads/ folder
        for (const product of products) {
            if (product.image && !product.image.startsWith('http')) {
                const imagePath = path.join(__dirname, '../../uploads', product.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
        }

        // Hard delete all products from the database
        await Product.deleteMany({});

        req.flash('success_msg', `All products cleared successfully (${products.length} removed)`);
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Server Error: Could not clear products');
        res.redirect('/admin/products');
    }
};
