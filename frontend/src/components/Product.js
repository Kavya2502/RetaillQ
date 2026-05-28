import { useEffect, useState } from "react";
import axios from "axios";

function Product() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    category: ""
  });

  const [editId, setEditId] = useState(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://retailiq-backend-tbs4.onrender.com/api/products");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        // UPDATE
        await axios.put(`https://retailiq-backend-tbs4.onrender.com/api/products/${editId}`, form);
        setEditId(null);
      } else {
        // ADD
        await axios.post("https://retailiq-backend-tbs4.onrender.com/api/products", form);
      }

      setForm({
        name: "",
        price: "",
        quantity: "",
        category: ""
      });

      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    await axios.delete(`https://retailiq-backend-tbs4.onrender.com/api/products/${id}`);
    fetchProducts();
  };

  // Edit product
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      category: product.category
    });

    setEditId(product._id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{editId ? "Edit Product" : "Add Product"}</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        <input name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />

        <button type="submit">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      <h2>Products</h2>

      {products.map((p) => (
        <div key={p._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <strong>{p.name}</strong> <br />
          ₹{p.price} | Qty: {p.quantity}

          {p.quantity < 5 && (
            <p style={{ color: "red" }}>⚠️ Low Stock</p>
          )}

          <br />

          <button onClick={() => handleEdit(p)}>Edit</button>
          <button onClick={() => handleDelete(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Product;
