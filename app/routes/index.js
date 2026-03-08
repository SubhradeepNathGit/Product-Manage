const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/', customerController.getHomePage);
router.get('/product/:id', customerController.getProductDetail);

module.exports = router;
