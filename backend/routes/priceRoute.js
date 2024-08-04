import express from "express";
import Price from "../models/priceModel.js";

const router = express.Router();

router.get("/", (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 5, 500);

  Price.find()
    .limit(limit)
    .then((prices) => res.json(prices))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// find most discounted
router.get("/most-discounted", async (req, res) => {
  let limit = parseInt(req.query.limit) || 5; // Default to 5 items
  limit = Math.min(limit, 500); // Limit to 500 items

  try {
    // Find the latest date in the collection
    const latestDate = await Price.aggregate([
      {
        $group: {
          _id: null,
          latestDate: { $max: "$date" }
        }
      }
    ]);

    if (latestDate.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    const maxDate = latestDate[0].latestDate;

    // Now, find the highest discount with the latest date
    const prices = await Price.aggregate([
      {
        $group: {
          _id: "$sku",
          max_discount: { $max: "$discount (%)" },
          doc: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
      {
        $match: {
          date: maxDate,
        },
      },
      { $sort: { "discount (%)": -1 } },
      { $limit: limit },
    ]);

    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:sku", (req, res) => {
  const { sku } = req.params;

  Price.find({ sku }) // Find all prices for the given SKU
    .limit(1000) // Limit to 1000 items
    .sort({ date: -1 }) // Sort by date in descending order
    .then((prices) => res.json(prices))
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.get("/latest/:sku", async (req, res) => {
  const { sku } = req.params;

  try {
    // Find the latest price entry for the given SKU
    const latestPrice = await Price.findOne({ sku })
      .sort({ date: -1 }) // Sort by date in descending order
      .exec();

    if (latestPrice) {
      res.json(latestPrice);
    } else {
      res.status(404).json({ message: "No price found for the given SKU" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
