import React from "react";
import SearchBar from "../components/SearchBar";
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";

const retrieveSearchResults = async (searchQuery) => {
  const url = `${import.meta.env.VITE_BACKEND_URL}search?query=${encodeURIComponent(searchQuery)}`;
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
};

export const QueryResult = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const { data: products, isLoading } = useQuery(
    ['search_results', query],  // Include the query as part of the query key
    () => retrieveSearchResults(query),  // Pass the query to the API call function
    {
      refetchInterval: 1000 * 60 * 15, //
      refetchOnWindowFocus: false,
    }
  );

  console.log(products);

  if (isLoading || !products) {
    return (
      <div>
        <NavBar />
        <div className="min-h-40 mt-10">
          <SearchBar />
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium">Loading...</div> 
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="min-h-40 mt-10">
        <SearchBar/>
      </div>
      <div className="p-4">
        <h5 className="text-3xl font-bold">Sort by</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4 border-2 border-gray-300 p-4 rounded-sm">
          {products.map((product) => (
            <ProductCard
              key={product.sku}
              product={{
                sku: product._id,
                name: product.name,
                image: product.image,
                url: product.url,
                price: product.product_prices[0]["price (VND)"] || 0,
                retailPrice: product.product_prices[0]["retail price (VND)"] || 0,
                discount: product.product_prices[0]["discount (%)"] || 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueryResult;
