import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "prices/most-discounted?limit=5")
      .then((response) => {
        const prices = response.data.reduce((acc, price) => {
          acc[price.sku] = price;
          return acc;
        }, {});
        setPrices(prices);
        setLoading(false);

        Object.keys(prices).forEach((sku) => {
          fetchProduct(sku);
        });
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const fetchProduct = (sku) => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + `products/${sku}`)
      .then((response) => {
        setProducts((prev) => [...prev, response.data]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <NavBar />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Featured Sales</h1>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 border-2 border-gray-300 p-4 rounded-lg">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                price={prices[product._id]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
