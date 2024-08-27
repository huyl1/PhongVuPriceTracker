import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import NavBar from "../components/NavBar";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const ShowProduct = () => {
  const [prices, setPrices] = useState([]);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const { sku } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(import.meta.env.VITE_BACKEND_URL + `products/${sku}`)
      .then((response) => {
        setProduct(response.data);
        fetchPriceHistory(sku);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [sku]);

  const fetchPriceHistory = async (sku) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + `prices/${sku}`
      );
      setPrices(
        response.data.map((item) => ({
          ...item,
          date: item.date.split("T")[0], // yyyy-mm-dd
        }))
      );
    } catch (error) {
      console.error(`Error fetching price history for SKU ${sku}:`, error);
    }
  };

  // Currency formatter for VND
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div>
      <NavBar />
      <div className="p-4">
        <BackButton />
        <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>
        <div className="flex flex-col md:flex-row items-center mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="rounded max-w-full md:max-w-[400px] max-h-[400px] w-auto h-auto mb-4 md:mb-0 md:mr-8"
          />
          {loading ? (
            <Spinner />
          ) : prices.length <= 1 ? (
            <div className="w-full h-64 sm:h-80 md:h-96 flex items-center justify-center bg-gray-200 text-gray-600">
              No price history
            </div>
          ) : (
            <div className="w-full h-64 sm:h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={prices}
                  margin={{ top: 25, right: 30, left: 45, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickMargin={10} />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip formatter={formatCurrency} />
                  <Line
                    type="monotone"
                    dataKey="retail price (VND)"
                    name="Retail Price"
                    stroke="#000000"
                    strokeWidth={4} 
                    activeDot={{ r: 8 }}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="price (VND)"
                    name="Discounted Price"
                    stroke="#427F45"
                    strokeWidth={4}
                    activeDot={{ r: 8 }}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowProduct;
