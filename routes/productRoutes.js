const router = require('express').Router();
const { addProduct, addCategoryToProduct, getProducts , editProductImage , editCategoryImage } = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');
const upload = require('../multer');

const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");
const mongoose = require('mongoose');
const { deleteCategory } = require('../controllers/productController');
const { deleteProduct } = require('../controllers/productController');

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

// DELETE a category by categoryId inside product by productId
router.delete(
  "/:productId/categories/:categoryId",
  protect,
  validateObjectId("productId"),
  validateObjectId("categoryId"),
  deleteCategory

);
router.delete('/:id', protect, validateObjectId('id'), deleteProduct);

router.put(
  '/:id/logo',
  protect,
  validateObjectId('id'),
  upload.single('logo'),
  editProductImage
);

router.put(
  '/:productId/categories/:categoryId/image',
  protect,
  validateObjectId('productId'),
  validateObjectId('categoryId'),
  upload.single('image'),
  editCategoryImage
);


module.exports = router;
