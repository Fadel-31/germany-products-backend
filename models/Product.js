const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: String,        // new field
  description: String,
  price: Number,
  image: String,
});


const productSchema = new mongoose.Schema({
  title: String,
  logo: String,
  categories: [categorySchema],
});

module.exports = mongoose.model('Product', productSchema);
