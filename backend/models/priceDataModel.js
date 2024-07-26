const mongoose = require('mongoose');

const priceDataSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // Using ObjectId type for MongoDB _id
  sku: { type: String, required: true },
  date: { type: Date, required: true },
  priceVND: { type: Number, required: true },
  retailPriceVND: { type: Number, required: true },
  discountPercent: { type: Number, required: true }
});

const PriceData = mongoose.model('PriceData', priceDataSchema);

module.exports = PriceData;