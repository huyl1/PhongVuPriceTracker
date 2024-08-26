import React from "react";

export const SearchBar = () => {
  return (
    <div className="w-screen flex justify-center items-center p-4">
      <div className="max-w-[780px] w-full">
        <form action="/search" className="w-full px-4">
          <div className="relative">
            <input
              type="text"
              name="query"
              className="w-full border h-12 shadow p-4 rounded-full dark:text-gray-800 dark:border-gray-700 dark:bg-gray-200"
              placeholder="Search over 12000+ products..."
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
