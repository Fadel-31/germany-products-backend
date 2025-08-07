const router = require('express').Router();
const { addProduct, addCategoryToProduct, getProducts } = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');
const upload = require('../multer');

const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

const mongoose = require('mongoose');
function validateObjectId(paramName) {
  return (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
      return res.status(400).json({ message: `Invalid ID: ${paramName}` });
    }
    next();
  };
}

// Add Product
router.post('/', protect, upload.single('logo'), addProduct);

// Add Category to Product (validate product ID)
router.post(
  '/:id/categories',
  protect,
  validateObjectId('id'),
  upload.single('image'),
  addCategoryToProduct
);

// Get all Products
router.get('/', getProducts);

// DELETE a product by ID (validate ID)
router.delete(
  "/:id",
  protect,
  validateObjectId("id"),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });

      // Remove product logo image
      if (product.logo) {
        fs.unlink(path.join(__dirname, "..", "uploads", product.logo), (err) => {
          if (err) console.log("Error deleting logo:", err);
        });
      }

      // Remove category images
      product.categories.forEach((cat) => {
        if (cat.image) {
          fs.unlink(path.join(__dirname, "..", "uploads", cat.image), (err) => {
            if (err) console.log("Error deleting category image:", err);
          });
        }
      });

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE a category by product ID and category ID (validate both IDs)
router.delete(
  "/:productId/categories/:categoryId",
  protect,
  validateObjectId("productId"),
  validateObjectId("categoryId"),
  async (req, res) => {
    const { productId, categoryId } = req.params;

    try {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "Product not found" });

      const category = product.categories.id(categoryId);
      if (!category) return res.status(404).json({ message: "Category not found" });

      // Delete category image
      if (category.image) {
        fs.unlink(path.join(__dirname, "..", "uploads", category.image), (err) => {
          if (err) console.log("Error deleting image:", err);
        });
      }

      category.remove();
      await product.save();

      res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
