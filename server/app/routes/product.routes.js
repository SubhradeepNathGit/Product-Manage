const express = require("express");
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    restoreProduct,
    forceDeleteProduct
} = require("../controllers/product.controller");

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const { productValidation } = require("../middleware/validators");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);

// Protected Routes
router.post("/", protect, upload.single("image"), productValidation, createProduct);
router.put("/:id", protect, upload.single("image"), productValidation, updateProduct);
router.delete("/:id", protect, deleteProduct);
router.put("/:id/restore", protect, restoreProduct);
router.delete("/:id/force", protect, forceDeleteProduct);

module.exports = router;
