import express from "express";
import Price from "../models/priceModel.js";

const router = express.Router();

router.get("/", (req, res) => {
  Price.find()
    .limit(25)
    .then((prices) => res.json(prices))
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.get('/latest/:sku', async (req, res) => {
  const { sku } = req.params;

  try {
    // Find the latest price entry for the given SKU
    const latestPrice = await Price.findOne({ sku })
      .sort({ date: -1 }) // Sort by date in descending order
      .exec();

    if (latestPrice) {
      res.json(latestPrice);
    } else {
      res.status(404).json({ message: 'No price found for the given SKU' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
