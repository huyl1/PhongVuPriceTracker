import express from "express";
import Product from "../models/productModel.js";
import Price from "../models/priceModel.js";

const router = express.Router();

const sortParams = (sortText) => {
  switch (sortText) {
    case "price-low-to-high":
      return { last_price: 1 };
    case "price-high-to-low":
      return { last_price: -1 };
    case "discount-high-to-low":
      return { last_discount: -1 };
    default:
      return { score: { $meta: "searchScore" } };
  }
};

router.get("/", async (req, res) => {
  let query = req.query.query || "macbook";
  const productsPerPage = 6;
  const page = req.query.page > 0 ? req.query.page - 1 : 0;
  const sort = req.query.sort || "relevance";

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
          text: {
            query: query,
            path: ["brand", "name_normalized"],
          },
        },
      },
      {
        $match: {
          last_price: {
            $exists: true,
          },
        },
      },
      ...(sort !== "relevance" ? [{ $sort: sortParams(sort) }] : []), // if sort is not relevance, sort the results
      { $limit: 100 }, // limit the number of results to ensure quality
      { $skip: productsPerPage * page },
      { $limit: productsPerPage },
      //join with prices collection
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
