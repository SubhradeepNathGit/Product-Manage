const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const upload = require('../middleware/upload');

// Dashboard
router.get('/', adminController.getDashboard);

// Categories
router.get('/categories', adminController.getCategories);
router.get('/categories/add', adminController.getAddCategory);
router.post('/categories/add', adminController.postAddCategory);
router.get('/categories/edit/:id', adminController.getEditCategory);
router.post('/categories/edit/:id', adminController.postEditCategory);
router.get('/categories/delete/:id', adminController.deleteCategory);

// Products
router.get('/products', adminController.getProducts);
router.get('/products/add', adminController.getAddProduct);
router.post('/products/add', upload.single('image'), adminController.postAddProduct);
router.get('/products/edit/:id', adminController.getEditProduct);
router.post('/products/edit/:id', upload.single('image'), adminController.postEditProduct);
router.get('/products/delete/:id', adminController.deleteProduct);
router.post('/products/clear-all', adminController.clearAllProducts);

module.exports = router;
