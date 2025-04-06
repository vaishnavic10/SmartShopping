import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Product {
  Product_ID: number;
  Brand: string;
  Category: string;
  Subcategory: string;
  Product_Rating: number;
  Price: number;
}

const PurchaseHistory: React.FC = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!customerId || customerId.trim() === "") {
        setMessage("⚠️ Please enter a valid Customer ID.");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post("http://localhost:5000/purchase-history", {
          customer_id: customerId,
        });
        setHistory(response.data.history);
        setMessage(response.data.message);
      } catch (error) {
        console.error("Error fetching purchase history:", error);
        setMessage("❌ Failed to fetch purchase history. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [customerId]);

  return (
    <div className="p-6">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mb-4 text-sm px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-200"
      >
        ← Back to Main Page
      </button>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🧾 Purchase History for Customer ID: {customerId || "N/A"}
      </h2>

      <p className="text-gray-600 mb-2">{message}</p>

      {loading ? (
        <p>Loading...</p>
      ) : message === "⚠️ Please enter a valid Customer ID." ? (
        <p className="text-red-500">{message}</p>
      ) : history.length === 0 ? (
        <p>No purchase history found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Product ID</th>
              <th className="border p-2">Brand</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Subcategory</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {history.map((product) => (
              <tr key={product.Product_ID}>
                <td className="border p-2">{product.Product_ID}</td>
                <td className="border p-2">{product.Brand}</td>
                <td className="border p-2">{product.Category}</td>
                <td className="border p-2">{product.Subcategory}</td>
                <td className="border p-2">{product.Product_Rating}</td>
                <td className="border p-2">₹{product.Price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PurchaseHistory;
