import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState({});
  const [discounts, setDiscounts] = useState({});

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
        // Fetch prices for each product
        response.data.forEach((product) => {
          fetchPrice(product._id);
        });
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const fetchPrice = async (sku) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/prices/latest/${sku}`
      );
      const price = response.data["price (VND)"];
      const discount = response.data["discount (%)"];
      setPrices((prevPrices) => ({ ...prevPrices, [sku]: price }));
      setDiscounts((prevDiscounts) => ({ ...prevDiscounts, [sku]: discount }));
    } catch (error) {
      console.error(`Error fetching price for SKU ${sku}:`, error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg shadow">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <h2 className="text-xl font-bold">
                {product.name.length > 30
                  ? `${product.name.substring(0, 40)}...`
                  : product.name}
              </h2>
              <p className="text-gray-700">
                {prices[product._id]
                  ? `${prices[product._id].toLocaleString()} VND`
                  : "Loading price..."}
                <span
                  className={`ml-2 ${
                    discounts[product._id] ? "text-red-500" : "text-red-500"
                  }`}
                >
                  {discounts[product._id] ? `-${discounts[product._id]}%` : ""}
                </span>
              </p>
              <p>
                {" "}
                <a href={product.url} className="text-blue-500 underline">
                  View Product
                </a>
              </p>
              <Link
                to={`/prices/${product._id}`}
                className="text-blue-500 underline"
              >
                View Price History
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Home;
