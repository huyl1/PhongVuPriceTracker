import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: String,
  brand: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

const Product = mongoose.model("product", productSchema, "products");

export default Product;
