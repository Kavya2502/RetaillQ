import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://retailiq.onrender.com/api/products");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalProducts = products.length;

  const totalValue = products.reduce(
    (acc, p) => acc + p.price * p.quantity,
    0
  );

  const data = {
    labels: products.map((p) => p.name),
    datasets: [
      {
        label: "Stock Quantity",
        data: products.map((p) => p.quantity)
      }
    ]
  };

  return (
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      <h1>📊 RetailIQ Dashboard</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
          <h3>Total Companies / Brands</h3>
          <h1>{[...new Set(products.map((product) => product.brand ))].length}</h1>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
          <h3>Total Inventory Value</h3>
          <p>₹{totalValue}</p>
        </div>
      </div>

      <h2>Stock Overview</h2>

      <Bar data={data} />
    </div>
  );
}

export default Dashboard;