import express from "express";
import Price from "../models/priceModel.js";
import Product from "../models/productModel.js";

const router = express.Router();

router.get("/most-discounted", async (req, res) => {
  let limit = parseInt(req.query.limit) || 5; // Default to 5 items
  limit = Math.min(limit, 500); // Limit to 500 items
  let isDemo = req.query.demo === 'true';

  try {
    // Find the latest date in the collection
    const latestDate = await Price.aggregate([
      {
        $group: {
          _id: null,
          latestDate: { $max: "$date" },
        },
      },
    ]);

    if (latestDate.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    const maxDate = latestDate[0].latestDate;

    // Now, find the highest discount with the latest date
    const prices = await Price.aggregate([
      {
        $match: {
          date: maxDate,
        },
      },
      {
        $group: {
          _id: "$sku",
          max_discount: { $max: "$discount (%)" },
          doc: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $sort: { "discount (%)": -1 } },
      {
        $lookup: {
          from: "products",
          localField: "sku",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $match: {
          "productDetails.demo": isDemo,
        }
      },
      { $limit: limit },
      {
        $unwind: "$productDetails",
      },
      {
        $project: {
          _id: 0,
          sku: 1,
          "price (VND)": 1,
          "retail price (VND)": 1,
          "discount (%)": 1,
          "productDetails.name": 1,
          "productDetails.url": 1,
          "productDetails.image": 1,
        },
      },
    ]);

    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
