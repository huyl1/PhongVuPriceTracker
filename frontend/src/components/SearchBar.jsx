import React from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export const SearchBar = () => {

  const navigate = useNavigate();

  // handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query');
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  // fetch the query from the url
  const query = new URLSearchParams(window.location.search).get("query") || "";

  return (
    <div className="w-screen flex justify-center items-center p-4 max-w-full">
      <div className="max-w-[780px] w-full">
        <form onSubmit={handleSubmit} className="w-full px-4">
          <div className="relative">
            <input
              type="text"
              name="query"
              className="w-full border h-12 shadow p-4 rounded-full dark:text-gray-800 dark:border-gray-700 dark:bg-gray-200"
              placeholder="Search over 12000+ products..."
              defaultValue={query}
            />
            <button 
              type="submit"
              className="absolute right-0 top-0 h-12 w-12 bg-green-800 flex items-center justify-center rounded-r-full"
            ></button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
