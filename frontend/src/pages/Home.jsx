import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "collections/most-discounted?limit=5")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

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
                key={product.sku}
                product={{
                  sku: product.sku,
                  name: product.productDetails.name,
                  image: product.productDetails.image,
                  url: product.productDetails.url,
                  price: product["price (VND)"],
                  retailPrice: product["retail price (VND)"],
                  discount: product["discount (%)"]
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
