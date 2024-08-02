import mongoose from 'mongoose';

const priceDataSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  sku: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  retailPrice: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  }
});

const Price = mongoose.model('price', priceDataSchema);

export default Price;