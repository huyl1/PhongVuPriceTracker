import React, { useEffect } from "react";
import SearchBar from "../components/SearchBar";
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { useInfiniteQuery, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";

const retrieveSearchResults = async ({ queryKey, pageParam }) => {
  const url = `${
    import.meta.env.VITE_BACKEND_URL
  }search?query=${encodeURIComponent(queryKey[1])}&sort=${queryKey[2]}&page=${
    pageParam || 0
  }`;
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
};

// helper to get product details
const getProductDetails = (product) => ({
  sku: product._id,
  name: product.name,
  image: product.image,
  url: product.url,
  // product.product_prices can be an empty array --> default to "n/a"
  price: product.product_prices?.[0]?.["price (VND)"] ?? "n/a",
  retailPrice: product.product_prices?.[0]?.["retail price (VND)"] ?? "n/a",
  discount: product.product_prices?.[0]?.["discount (%)"] ?? 0,
});

export const QueryResult = () => {
  const query = useSearchParams()[0].get("query"); //fetch query from url

  const [sort, setSort] = React.useState("relevance");
  const { ref, inView } = useInView();

  const { data, status, error, fetchNextPage, hasNextPage} = useInfiniteQuery({
    queryKey: ["search", query, sort],
    queryFn: retrieveSearchResults,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 0 ? undefined : pages.length + 1;
    },
  });

  // infinite scroll
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (status === "loading") {
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

  if (status === "error") {
    return (
      <div>
        <NavBar />
        <div className="min-h-40 mt-10">
          <SearchBar />
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium">Error: {error.message}</div>
        </div>
      </div>
    );
  }

  if (data.pages[0].length === 0) {
    return (
      <div>
        <NavBar />
        <div className="min-h-40 mt-10">
          <SearchBar />
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium">No results found.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="min-h-40 mt-10">
        <SearchBar />
      </div>
      <div className="p-4 relative">
        <h5 className="text-3xl font-bold">Sort by</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4 border-2 border-gray-300 p-4 rounded-sm">
          {data.pages.map((page) => 
            page.map((product) => (
              <ProductCard
                key={product.sku}
                product={getProductDetails(product)}
              />
            ))
          )}
          {hasNextPage && <div className="absolute bottom-0 left-0 w-full h-80" ref={ref}></div>}
        </div>
      </div>
      {!hasNextPage && <div className="text-center text-gray-500">End of results.</div>}
      {console.log(hasNextPage)}
    </div>
  );
};

export default QueryResult;
