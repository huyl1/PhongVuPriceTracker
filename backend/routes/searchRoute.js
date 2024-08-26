import express from "express";
import Product from "../models/productModel.js";
import Price from "../models/priceModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let query = req.query.query || "macbook";
  const limit = req.query.limit || 50;
  console.log("query:", query);
  if (limit > 50) {
    limit = 50;
  }
  if (query.length < 3) {
    return res
      .status(400)
      .json({ message: "Query length must be at least 3 characters." });
  }

  // normalize query
  query = query.toLowerCase().trim;

  try {
    const products = await Product.aggregate([
      {
        $match: {
          name_normalized: { $regex: "macbook", $options: "i" },
        },
      },
    ]);
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
