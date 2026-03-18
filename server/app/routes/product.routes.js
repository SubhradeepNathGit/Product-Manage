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
const { checkPermission } = require("../middleware/rbac");
const upload = require("../middleware/upload");

const { productValidation } = require("../middleware/validators");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);

// Protected Routes
router.post("/", protect, checkPermission("create_product"), upload.single("image"), productValidation, createProduct);
router.put("/:id", protect, checkPermission("update_product"), upload.single("image"), productValidation, updateProduct);
router.delete("/:id", protect, checkPermission("delete_product"), deleteProduct);
router.put("/:id/restore", protect, checkPermission("update_product"), restoreProduct);
router.delete("/:id/force", protect, checkPermission("delete_product"), forceDeleteProduct);

module.exports = router;
