const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.String,
  brand: { type: String, required: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;