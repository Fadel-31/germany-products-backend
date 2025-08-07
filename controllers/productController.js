const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
  const { title } = req.body;
  const logo = req.file?.filename || '';
  const product = await Product.create({ title, logo });
  res.json(product);
};

exports.addCategoryToProduct = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("=== Add Category to Product ===");
    console.log("Product ID param:", id);
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const { title, description, price } = req.body;
    const image = req.file?.filename || '';

    if (!title || !description || price == null || price === '') {
      console.log("Validation failed - missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.findById(id);
    if (!product) {
      console.log("Product not found:", id);
      return res.status(404).json({ message: "Product not found" });
    }

    product.categories.push({
      title,
      description,
      price: Number(price),
      image,
    });

    await product.save();
    console.log("Category added successfully");
    res.json(product);
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: "Product not found" });
  res.json({ message: 'Product deleted' });
};

exports.deleteCategory = async (req, res) => {
  const { productId, categoryId } = req.params;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  product.categories = product.categories.filter(cat => cat._id.toString() !== categoryId);
  await product.save();

  res.json(product);
};
