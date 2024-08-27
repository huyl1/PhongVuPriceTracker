import express from "express";
import Product from "../models/productModel.js";
import Price from "../models/priceModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let query = req.query.query || "macbook";
  const productsPerPage = 6;
  const page = req.query.page || 0;

  if (!query || query.length < 3) {
    return res
      .status(400)
      .json({ message: "Query length must be at least 3 characters." });
  }

  //remove accents and special characters from query
  query = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  try {
    const products = await Product.aggregate([
      // search for products
      { 
        $search: {
          index: "searchProduct",
          text: {
            query: query,
            path: ["brand", "name_normalized"]
          }
        }
      },
      { $skip: productsPerPage * page },
      { $limit: productsPerPage },
      { $sort: { score: { $meta: "textScore" } } },
      // join with prices collection
      {
        $lookup: {
          from: "prices", // the collection to join
          let: { product_id: "$_id", last_update: "$last_update" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$sku", "$$product_id"] },
                    { $eq: ["$date", "$$last_update"] },
                  ],
                },
              },
            },
          ],
          as: "product_prices",
        },
      },
    ]);

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
