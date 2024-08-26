import React from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

const retrieveProducts = async () => {
  const { data } = await axios.get(
    import.meta.env.VITE_BACKEND_URL + "collections/most-discounted?limit=12"
  );
  return data;
};

const retrieveSuggestions = async () => {
  const { data } = await axios.get(
    import.meta.env.VITE_BACKEND_URL + "suggestions"
  );
  return data;
};

export const Home = () => {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery("home_products", retrieveProducts, {
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const { data: suggestions } = useQuery("suggestions", retrieveSuggestions, {
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <NavBar />
      <div className="min-h-40 mt-10">
        <SearchBar />
        {suggestions && (
          <div className="flex flex-wrap mt-2 justify-center">
            {suggestions.map((suggestion) => (
              <div key={suggestion} className="p-4">
                <Link
                  to={`/search?query=${encodeURIComponent(suggestion).replace(
                    /%20/g,
                    "+"
                  )}`}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {suggestion}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <h5 className="text-3xl font-bold">Top Sales</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4 border-2 border-gray-300 p-4 rounded-sm">
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
                discount: product["discount (%)"],
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
