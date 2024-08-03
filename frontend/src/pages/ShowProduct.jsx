import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ShowProduct = () => {
  const [prices, setPrices] = useState([]);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const { sku } = useParams();

  console.log(sku);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/products/${sku}`)
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
      const response = await axios.get(`http://localhost:3000/prices/${sku}`);
      setPrices(response.data.map(item => ({
        ...item,
        date: item.date.split('T')[0]  // This splits the date string and takes only the date part
      })));
    } catch (error) {
      console.error(`Error fetching price history for SKU ${sku}:`, error);
    }
  };

  // Currency formatter for VND
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>
      <div className="flex items-center mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="rounded max-w-[400px] max-h-[400px] w-auto h-auto mr-8"
        />
        {loading ? (
          <Spinner />
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={prices}
              margin={{ top: 5, right: 30, left: 45, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickMargin={10}/>
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={formatCurrency} />
              <Line
                type="monotone"
                dataKey="retail price (VND)"
                stroke="#ff0000"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="price (VND)"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ShowProduct;
