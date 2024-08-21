/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({product}) => {
  return (
    <div className="border p-4 rounded-lg shadow">
      <Link to={`/prices/${product.sku}`}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-48 object-cover mb-2 rounded"
        />
      </Link>
      <h2 className="text-xl font-bold">
        {product.name.length > 30
          ? `${product.name.substring(0, 40)}...`
          : product.name}
      </h2>
      <p className="text-gray-700">
          <>
            <span className="line-through">
              {product.retailPrice.toLocaleString()} VND
            </span>
            <br />
            <span className="text-lg font-semibold">
              {`${product.price.toLocaleString()} VND`}
            </span>
            <span
              className={`ml-2 ${
                product.discount ? "text-red-500" : "text-gray-500"
              }`}
            >
              {product.discount ? `-${product.discount}%` : ""}
            </span>
          </>
      </p>
      <p>
        <a href={product.url} className="text-blue-500 underline">
          View Product
        </a>
      </p>
      <Link to={`/prices/${product.sku}`} className="text-blue-500 underline">
        View Price History
      </Link>
    </div>
  );
};

export default ProductCard;
