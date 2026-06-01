import React, { useState } from "react";
import {BrowserRouter,Routes,Route,Link,useNavigate,Navigate,} from "react-router-dom";
import "./App.css";
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,} from "recharts";
import jsPDF from "jspdf";

/* ---------------- HOME ---------------- */
function Home() {
  return (
    <div className="app">
      <nav className="navbar">
        <h2 className="logo">RetailIQ</h2>

        <div className="nav-links">
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>

          <Link to="/register">
            <button className="start-btn">Get Started</button>
          </Link>
        </div>
      </nav>

      <section className="hero clean-hero">
        <div className="center-content">
          <div className="badge">Smart Inventory & Billing System</div>

          <h1>
            Run Your Electronics Store <br />
            with <span>RetailIQ</span>
          </h1>

          <p>
            Manage inventory, track sales, generate bills, and monitor business
            performance — all in one place.
          </p>

          <div className="hero-buttons">
            <Link to="/login">
              <button className="primary-btn">Login</button>
            </Link>

            <Link to="/register">
              <button className="secondary-btn">Create Account</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
/* ---------------- LOGIN ---------------- */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("https://retailiq-backend-tbs4.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
  "user",
  JSON.stringify({
    ...data.user,
    role: role,
  })
);

      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Backend not connected");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p>Login to your RetailIQ account</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
  <label>Login As</label>

  <select
    value={role}
    onChange={(e) => setRole(e.target.value)}
  >
    <option value="admin">Admin</option>
    <option value="staff">Staff</option>
  </select>
</div>

          <button type="submit" className="login-submit">
            Login
          </button>
        </form>

        <p className="signup-text">
          Don&apos;t have an account?{" "}
          <Link to="/register">
            <span>Create Account</span>
          </Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

/* ---------------- REGISTER ---------------- */
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("https://retailiq-backend-tbs4.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Account created successfully. Please login.");
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Backend not connected");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Create Account</h1>
        <p>Join RetailIQ and manage your store smarter</p>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Create Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-submit">
            Create Account
          </button>
        </form>

        <p className="signup-text">
          Already have an account?{" "}
          <Link to="/login">
            <span>Login</span>
          </Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */
function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false);

  const [inventoryTarget, setInventoryTarget] = useState(
    localStorage.getItem("inventoryTarget") || 100000
  );

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://retailiq-backend-tbs4.onrender.com/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setProducts(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [token]);

  React.useEffect(() => {
    localStorage.setItem("inventoryTarget", inventoryTarget);
  }, [inventoryTarget]);

  const totalProducts = products.length;

  const totalValue = products.reduce((sum, product) => {
    return sum + product.price * product.stock;
  }, 0);

  const lowStockProducts = products.filter((product) => product.stock <= 3);

  const targetPercent = Math.min(
    Math.round((totalValue / Number(inventoryTarget || 1)) * 100),
    100
  );

  return (
    <div className="dashboard-premium">
      <nav className="dashboard-navbar">
        <h2 className="logo">RetailIQ</h2>

        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>

{user?.role === "admin" && (
  <Link to="/products">Products</Link>
)}
{user?.role === "admin" && (
  <Link to="/profit-loss">Profit/Loss</Link>
)}

{user?.role === "admin" && (
  <Link to="/analytics">Analytics</Link>
)}

<Link to="/billing">Billing</Link>

<Link to="/sales-invoices">Sales Invoices</Link>

{user?.role === "admin" && (
  <Link to="/purchase-invoices">Purchase Invoices</Link>
)}

          <button
            className="login-btn"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="dashboard-layout">
        <div className="dashboard-left">
          <div className="badge">Dashboard Overview</div>

          <h1>
            Welcome {user?.name} <br />
            to <span>RetailIQ</span>
          </h1>

          <p>
            Track your products, inventory value, and low-stock alerts from your
            personal store dashboard.
          </p>

          <Link to="/products">
            <button className="primary-btn">Manage Products</button>
          </Link>
        </div>

        <div className="premium-card">
          <h3>Store Overview</h3>

          <div className="premium-stats">
            <div className="stat-card">
              <h3>Brands</h3>

<h1>
  {
    [...new Set(
      products.map((product) => product.brand)
    )].length
  }
</h1>
            </div>

            <div className="stat-card">
              <span>Stock Value</span>
              <h2>₹{totalValue}</h2>
            </div>
          </div>

          <Link to="/low-stock" className="low-stock-premium">
  <div>
    <p>Low Stock Alert</p>
    <h4>
      {lowStockProducts.length > 0
        ? `${lowStockProducts.length} items need attention`
        : "Inventory looks good"}
    </h4>
  </div>

  <span className="alert-count">{lowStockProducts.length}</span>
</Link>

          <div className="target-box">
            <div className="target-top">
              <p>Inventory Target</p>
              <span>{targetPercent}%</span>
            </div>
  
            <div className="premium-bar">
              <div style={{ width: `${targetPercent}%` }}></div>
            </div>
             <input
  type="number"
  value={inventoryTarget}
  onChange={(e) => setInventoryTarget(e.target.value)}
  placeholder="Set target"
  style={{
    width: "130px",
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    marginBottom: "10px",
  }}
/>

<div className="inventory-progress">
  <div
    className="inventory-fill"
    style={{ width: `${targetPercent}%` }}
  ></div>
</div>

<small>
  Based on ₹{Number(inventoryTarget).toLocaleString()}  target value</small>
          </div>
        </div>
      </section>
    </div>
  );
}
/* ---------------- PROTECTED ROUTE ---------------- */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

/* ---------------- APP ---------------- */
function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Analytics />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Products />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchase-invoices"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <PurchaseInvoices />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales-invoices"
          element={
            <ProtectedRoute>
              <SalesInvoices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/low-stock"
          element={
            <ProtectedRoute>
              <LowStock />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profit-loss"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <ProfitLoss />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

/* -----------Product-------------*/
function Products() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
  });

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://retailiq-backend-tbs4.onrender.com/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setProducts(data);
    } catch (error) {
      console.log(error);
      alert("Could not fetch products");
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      category: "",
      price: "",
      stock: "",
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `https://retailiq-backend-tbs4.onrender.com/api/products/${editingId}`
      : "https://retailiq-backend-tbs4.onrender.com/api/products";

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert(editingId ? "Product updated" : "Product added");

      resetForm();
      setEditingId(null);
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://retailiq-backend-tbs4.onrender.com/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Product deleted");
      fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Could not delete product");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });

    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setShowModal(false);
    resetForm();
  };

  const categories = ["All", ...new Set(products.map((product) => product.category))];

  const filteredProducts = products.filter((product) => {
    const name = product.name || "";
    const brand = product.brand || "";
    const category = product.category || "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => Number(p.stock) < 3).length;
  const totalStock = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <p className="eyebrow">Inventory Control</p>
          <h1>Product Management</h1>
          <p>Manage products, stock levels, pricing and inventory details.</p>
        </div>

        <Link to="/dashboard" className="back-btn">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="product-stats">
        <div className="stat-card">
          <h3>Brands</h3>

<h1>
  {
    [...new Set(
      products.map((product) => product.brand)
    )].length
  }
</h1>
        </div>

        <div className="stat-card">
          <span>Total Stock</span>
          <h2>{totalStock}</h2>
        </div>

        <div className="stat-card warning">
          <span>Low Stock</span>
          <h2>{lowStockCount}</h2>
        </div>
      </div>

      <div className="product-form-card">
        <h2>Add New Product</h2>

        <form className="product-form premium-form" onSubmit={handleAddProduct}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />

          <button type="submit" className="primary-btn">
            Add Product
          </button>
        </form>
      </div>

      <div className="product-tools">
        <input
          type="text"
          placeholder="Search by product or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="product-table-card">
        <div className="table-header">
          <h2>Inventory List</h2>
          <p>{filteredProducts.length} products found</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-box">
            <h3>No products found</h3>
            <p>Try changing your search or category filter.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="premium-product-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="product-name">{product.name}</td>
                    <td>{product.brand}</td>
                    <td>{product.category}</td>
                    <td>₹{product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span
                        className={
                          Number(product.stock) < 3
                            ? "stock-badge low"
                            : "stock-badge available"
                        }
                      >
                        {Number(product.stock) < 3 ? "Low Stock" : "Available"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box premium-modal">
            <h2>Edit Product</h2>
            <p>Update product details and save the changes.</p>

            <form onSubmit={handleAddProduct} className="modal-form">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
              />

              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand}
                onChange={handleChange}
              />

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
              />

              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
              />

              <div className="modal-buttons">
                <button type="submit" className="primary-btn">
                  Update Product
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
/*----------LOW STOCK------------*/
function LowStock() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  React.useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("https://retailiq-backend-tbs4.onrender.com/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const lowStockProducts = products.filter((p) => p.stock <= 3);

  return (
    <div className="page">
      <h1>Low Stock Products</h1>

      {lowStockProducts.length === 0 ? (
        <p>All products are well stocked 🎉</p>
      ) : (
        <div className="product-list">
          {lowStockProducts.map((product) => (
            <div className="product-card" key={product._id}>
              <h3>{product.name}</h3>
              <p>Brand: {product.brand}</p>
              <p>Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
/*----------Analytics----------*/
function Analytics() {
  const [invoices, setInvoices] = useState([]);

  React.useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(
          "https://retailiq-backend-tbs4.onrender.com/api/invoices"
        );

        const data = await response.json();

        if (response.ok) {
          setInvoices(data);
        }

      } catch (error) {
        console.log(error);
      }
    };

    fetchInvoices();
  }, []);

  const totalRevenue = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.amount || 0),
    0
  );

  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === "Paid"
  ).length;

  const pendingInvoices = invoices.filter(
    (invoice) =>
      invoice.status === "Pending" ||
      invoice.status === "Unpaid"
  ).length;

  const totalReceived = invoices.reduce((sum, invoice) => {
  return sum + Number(invoice.amountReceived || 0);
}, 0);

const cashAvailable = invoices.reduce((sum, invoice) => {
  if (invoice.paymentMode === "Cash") {
    return sum + Number(invoice.amountReceived || 0);
  }
  return sum;
}, 0);

const accountBalance = invoices.reduce((sum, invoice) => {
  if (invoice.paymentMode === "UPI" || invoice.paymentMode === "Card") {
    return sum + Number(invoice.amountReceived || 0);
  }
  return sum;
}, 0);

const pendingBalance = invoices.reduce((sum, invoice) => {
  return sum + Number(invoice.balanceAmount || 0);
}, 0);

  const monthlyData = {};

  invoices.forEach((invoice) => {
    const month = invoice.date
      ? invoice.date.split("/")[1]
      : "Unknown";

    if (!monthlyData[month]) {
      monthlyData[month] = 0;
    }

    monthlyData[month] += Number(invoice.amount || 0);
  });

  const chartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: "Monthly Revenue",
        data: Object.values(monthlyData),
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="analytics-premium-page">

      <div className="analytics-header">
        <div>
          <h1>Sales Analytics</h1>
          <p>Track invoice performance and revenue insights.</p>
        </div>

        <Link to="/dashboard">
          <button className="back-btn">
            Back to Dashboard
          </button>
        </Link>
      </div>

      <div className="analytics-cards">
        <div className="analytics-card paid">
  <h3>Total Money Received</h3>
  <h1>₹{totalReceived}</h1>
</div>

<div className="analytics-card">
  <h3>Cash Available</h3>
  <h1>₹{cashAvailable}</h1>
</div>

<div className="analytics-card">
  <h3>Money in Account</h3>
  <h1>₹{accountBalance}</h1>
</div>

<div className="analytics-card pending">
  <h3>Pending Balance</h3>
  <h1>₹{pendingBalance}</h1>
</div>

        <div className="analytics-card">
          <h3>Total Revenue</h3>
          <h1>₹{totalRevenue}</h1>
        </div>

        <div className="analytics-card">
          <h3>Total Invoices</h3>
          <h1>{invoices.length}</h1>
        </div>

        <div className="analytics-card paid">
          <h3>Paid Invoices</h3>
          <h1>{paidInvoices}</h1>
        </div>

        <div className="analytics-card pending">
          <h3>Pending Invoices</h3>
          <h1>{pendingInvoices}</h1>
        </div>

      </div>

      <div className="chart-card">
        <h2>Monthly Revenue Overview</h2>

        <ResponsiveContainer width="100%" height={350}>
  <BarChart
    data={Object.keys(monthlyData).map((month) => ({
      month,
      revenue: monthlyData[month],
    }))}
  >
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="revenue" radius={[10, 10, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
      </div>

    </div>
  );
}
/*--------------Pdf---------------*/
async function createPremiumInvoicePDF(invoice) {
  const token = localStorage.getItem("token");

  const profileRes = await axios.get(
    "https://YOUR-BACKEND-URL.onrender.com/api/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const profile = profileRes.data || {};

  const doc = new jsPDF("p", "mm", "a4");

  const items = invoice.items || [];
  const totalAmount = invoice.amount || 0;

  const shopName = profile.shopName || "Your Shop Name";
  const gstin = profile.gstin || "-";
  const email = profile.email || "-";
  const address = profile.address || "-";
  const website = profile.website || "-";

  const accountName = profile.accountName || shopName;
  const ifsc = profile.ifsc || "-";
  const accountNumber = profile.accountNumber || "-";
  const bankName = profile.bankName || "-";

  const gold = [194, 154, 65];
  const lightGold = [250, 244, 225];
  const dark = [20, 20, 20];

  doc.setDrawColor(...gold);
  doc.setLineWidth(0.6);
  doc.rect(10, 10, 190, 277);

  doc.setFillColor(255, 255, 255);
  doc.rect(10, 10, 190, 45, "F");

  doc.setFillColor(37, 99, 235);
  doc.roundedRect(18, 18, 24, 24, 3, 3, "F");
  doc.setFillColor(245, 158, 11);
  doc.triangle(25, 20, 43, 24, 25, 42, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(shopName.charAt(0).toUpperCase(), 25, 35);

  doc.setTextColor(...dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(shopName, 50, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`GSTIN: ${gstin}`, 50, 28);
  doc.text(email, 50, 34);
  doc.text(address, 50, 40);
  doc.text(`Website: ${website}`, 50, 46);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("TAX INVOICE", 165, 22);

  doc.setDrawColor(...gold);
  doc.line(10, 55, 200, 55);

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice No.", 18, 65);
  doc.text("Invoice Date", 60, 65);

  doc.setFont("helvetica", "normal");
  doc.text(invoice.invoiceNo || "-", 18, 73);
  doc.text(invoice.date || new Date().toLocaleDateString(), 60, 73);

  doc.line(10, 80, 200, 80);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Bill To", 18, 92);
  doc.text("Ship To", 108, 92);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(invoice.customerName || "-", 18, 100);
  doc.text(`Mobile: ${invoice.customerPhone || "-"}`, 18, 107);
  doc.text("Place of Supply: Bihar", 18, 114);

  doc.text(invoice.customerName || "-", 108, 100);
  doc.text("Bihar, India", 108, 107);

  doc.line(105, 80, 105, 122);
  doc.line(10, 122, 200, 122);

  let y = 133;

  doc.setFillColor(...lightGold);
  doc.rect(10, y - 7, 190, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...dark);

  doc.text("No", 14, y);
  doc.text("Items", 25, y);
  doc.text("Qty", 86, y);
  doc.text("MRP", 105, y);
  doc.text("Rate", 128, y);
  doc.text("Tax", 153, y);
  doc.text("Total", 181, y);

  y += 11;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  if (items.length === 0) {
    doc.text("No item details available for this invoice.", 18, y);
    y += 12;
  }

  items.forEach((item, index) => {
    const price = Number(item.price || 0);
    const qty = Number(item.qty || 1);
    const amount = price * qty;

    const itemLines = doc.splitTextToSize(item.name || "Item", 50);

    doc.text(String(index + 1), 14, y);
    doc.text(itemLines, 25, y);
    doc.text(`${qty} PCS`, 86, y);
    doc.text(String(price), 105, y);
    doc.text(String(price), 128, y);
    doc.text("0", 156, y);
    doc.text(String(amount), 181, y);

    y += Math.max(12, itemLines.length * 5);
  });

  doc.line(10, y + 3, 200, y + 3);
  y += 12;

  doc.setFillColor(...lightGold);
  doc.rect(10, y - 7, 190, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.text("SUBTOTAL", 25, y);
  doc.text(String(items.length), 86, y);
  doc.text(`Rs. ${totalAmount}`, 153, y);
  doc.text(`Rs. ${totalAmount}`, 181, y);

  y += 15;
  doc.line(10, y, 200, y);

  const bottomY = y + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Terms & Conditions", 18, bottomY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("1. Goods once sold will not be returned or exchanged.", 18, bottomY + 7);
  doc.text("2. Warranty is covered by brand/company policy only.", 18, bottomY + 13);
  doc.text("3. Please keep this invoice for warranty claims.", 18, bottomY + 19);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Bank Details", 18, bottomY + 36);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Name: ${accountName}`, 18, bottomY + 44);
  doc.text(`IFSC: ${ifsc}`, 18, bottomY + 51);
  doc.text(`Account No: ${accountNumber}`, 18, bottomY + 58);
  doc.text(`Bank Name: ${bankName}`, 18, bottomY + 65);

  const taxableAmount = totalAmount / 1.18;
  const gstAmount = totalAmount - taxableAmount;
  const cgstAmount = gstAmount / 2;
  const sgstAmount = gstAmount / 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);

  doc.text("Taxable Amount", 112, bottomY + 5);
  doc.text(`Rs. ${taxableAmount.toFixed(2)}`, 170, bottomY + 5);

  doc.text("CGST @9%", 112, bottomY + 13);
  doc.text(`Rs. ${cgstAmount.toFixed(2)}`, 170, bottomY + 13);

  doc.text("SGST @9%", 112, bottomY + 21);
  doc.text(`Rs. ${sgstAmount.toFixed(2)}`, 170, bottomY + 21);

  doc.line(112, bottomY + 27, 190, bottomY + 27);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Total Amount", 112, bottomY + 36);
  doc.text(`Rs. ${totalAmount.toFixed(2)}`, 168, bottomY + 36);

  doc.roundedRect(132, 255, 52, 20, 2, 2);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Signature", 150, 266);
  doc.text(shopName, 141, 272);

  doc.save(`${invoice.invoiceNo || "invoice"}.pdf`);
}
/*------------Billing-----------*/
function Billing() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [billingSearch, setBillingSearch] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [discount, setDiscount] = useState(0);

  const token = localStorage.getItem("token");

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://retailiq-backend-tbs4.onrender.com/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setProducts(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [token]);

  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item._id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const subtotalAmount = cart.reduce(
  (sum, item) => sum + item.price * item.qty,
  0
);

const gstRate = 18;

const totalAmount = subtotalAmount - Number(discount || 0);

const taxableAmount =
  totalAmount / (1 + gstRate / 100);

const gstAmount =
  totalAmount - taxableAmount;

const cgstAmount = gstAmount / 2;

const sgstAmount = gstAmount / 2;

  const invoiceNo = "INV-" + Date.now().toString().slice(-6);

  const filteredBillingProducts = products.filter((product) => {
    const name = product.name || "";
    const brand = product.brand || "";
    const category = product.category || "";

    return (
      name.toLowerCase().includes(billingSearch.toLowerCase()) ||
      brand.toLowerCase().includes(billingSearch.toLowerCase()) ||
      category.toLowerCase().includes(billingSearch.toLowerCase())
    );
  });

  const generateInvoice = () => {
  if (!customerName || !customerPhone) {
    alert("Please enter customer details");
    return;
  }

  if (!/^\d{10}$/.test(customerPhone)) {
    alert("Enter valid 10-digit phone number");
    return;
  }

  if (cart.length === 0) {
    alert("Add products first");
    return;
  }

  const newInvoice = {
  id: Date.now(),
  date: new Date().toLocaleDateString(),
  invoiceNo: "INV-" + Date.now().toString().slice(-6),

  customerName,
  customerPhone,

  subtotal: subtotalAmount,
  discount: Number(discount || 0),
  gst: gstAmount,
  gstRate,

  amount: totalAmount,

  status: paymentStatus,
  paymentMode,
amountReceived: paymentStatus === "Paid" ? totalAmount : 0,
balanceAmount: paymentStatus === "Paid" ? 0 : totalAmount,
paymentDate: new Date().toLocaleDateString(),

  items: cart,
  
};
  fetch("https://retailiq-backend-tbs4.onrender.com/api/invoices", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newInvoice),
})
  .then(async (res) => {
    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("RESPONSE:", text);

    if (!res.ok) {
      alert("Invoice not saved. Check console.");
      return;
    }

    alert("Invoice saved successfully");
    setShowInvoice(true);
  })
  .catch((err) => {
    console.log("FETCH ERROR:", err);
    alert("Invoice not saved");
  });
}
const downloadInvoicePDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("RetailIQ Invoice", 20, 20);

  doc.setFontSize(12);
  doc.text(`Customer: ${customerName}`, 20, 35);
  doc.text(`Phone: ${customerPhone}`, 20, 45);
  doc.text(`Status: ${paymentStatus}`, 20, 55);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 65);

  doc.line(20, 75, 190, 75);

  let y = 90;

  cart.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.name}`, 20, y);
    doc.text(`Qty: ${item.qty}`, 95, y);
    doc.text(`Price: Rs. ${item.price}`, 125, y);
    doc.text(`Total: Rs. ${item.price * item.qty}`, 160, y);
    y += 10;
  });

  doc.line(20, y + 5, 190, y + 5);

  doc.setFontSize(16);
  doc.text(`Grand Total: Rs. ${totalAmount}`, 20, y + 20);

  doc.save(`invoice-${customerName}.pdf`);
};
  return (
    <div className="billing-page-premium">
      <div className="billing-header">
        <div>
          <h1>Create Sales Invoice</h1>
          <p>Generate professional bills for customers.</p>
        </div>

        <Link to="/dashboard" className="back-link">
          Back to Dashboard
        </Link>
      </div>

      <div className="invoice-shell">
        <div className="invoice-top-grid">
          <div className="invoice-panel">
            <h3>Bill To</h3>

            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Customer Phone Number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          <div className="invoice-panel">
            <h3>Invoice Details</h3>

            <div className="invoice-meta-grid">
              <div>
                <label>Invoice No.</label>
                <input type="text" value={invoiceNo} readOnly />
              </div>

              <div>
                <label>Date</label>
                <input
                  type="text"
                  value={new Date().toLocaleDateString()}
                  readOnly
                />
              </div>

              <div>
                <label>Payment Mode</label>
                <select
  value={paymentMode}
  onChange={(e) => setPaymentMode(e.target.value)}
>
  <option value="Cash">Cash</option>
  <option value="UPI">UPI</option>
  <option value="Card">Card</option>
</select>
              </div>

              <div>
                <label>Status</label>
                <select
  value={paymentStatus}
  onChange={(e) => setPaymentStatus(e.target.value)}
>
  <option value="Paid">Paid</option>
  <option value="Pending">Pending</option>
  <option value="Unpaid">Unpaid</option>
</select>
              </div>
            </div>
          </div>
        </div>

        <div className="invoice-products-section">
          <div className="invoice-products-header">
            <h3>Items / Services</h3>

            <input
              type="text"
              className="billing-search"
              placeholder="Search item by name, brand, or category..."
              value={billingSearch}
              onChange={(e) => setBillingSearch(e.target.value)}
            />
          </div>

          <div className="quick-product-list">
            {filteredBillingProducts.map((product) => (
              <button
                key={product._id}
                className="quick-product"
                onClick={() => addToCart(product)}
              >
                + {product.name} ₹{product.price}
              </button>
            ))}
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Item / Service</th>
                <th>Brand</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {cart.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-row">
                    No items added. Search and add items above.
                  </td>
                </tr>
              ) : (
                cart.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.brand}</td>
                    <td>
                      <div className="qty-controls">
                        <button onClick={() => decreaseQty(item._id)}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => increaseQty(item._id)}>+</button>
                      </div>
                    </td>
                    <td>₹{item.price}</td>
                    <td>₹{item.price * item.qty}</td>
                    <td>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="invoice-bottom-grid">
          <div className="invoice-panel">
            <h3>Terms & Conditions</h3>
            <p>1. Goods once sold will not be returned.</p>
            <p>2. Warranty is subject to company policy.</p>
            <p>3. Please keep invoice for warranty claims.</p>
          </div>

          <div className="total-panel">
            <div className="total-row">
  <span>Subtotal</span>
  <strong>₹{subtotalAmount.toFixed(2)}</strong>
</div>

<div className="total-row">
  <span>GST ({gstRate}%)</span>
  <strong>₹{gstAmount.toFixed(2)}</strong>
</div>

<div className="total-row">
  <span>Discount</span>

  <input
    type="number"
    value={discount}
    onChange={(e) => setDiscount(e.target.value)}
    placeholder="Enter discount"
    style={{
      width: "120px",
      padding: "8px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      textAlign: "right",
    }}
  />
</div>

<div className="grand-total">
  <span>Total Amount</span>
  <strong>₹{totalAmount.toFixed(2)}</strong>
</div>

<div className="total-row">
  <span>Amount Received</span>

  <strong>
    ₹
    {paymentStatus === "Paid"
      ? totalAmount.toFixed(2)
      : 0}
  </strong>
</div>

<div className="total-row">
  <span>Balance</span>

  <strong>
    ₹
    {paymentStatus === "Paid"
      ? 0
      : totalAmount.toFixed(2)}
  </strong>
</div>

<button
  className="generate-btn"
  onClick={generateInvoice}
>
  Generate Invoice
</button>
          </div>
        </div>
      </div>

      {showInvoice && (
        <div className="invoice-modal">
          <div className="invoice-box">
            <h2>Invoice Generated</h2>

            <p>
              <strong>Customer:</strong> {customerName}
            </p>
            <p>
              <strong>Phone:</strong> {customerPhone}
            </p>
            <p>
              <strong>Total:</strong> ₹{totalAmount}
            </p>

            <button onClick={() => setShowInvoice(false)}>Close</button>
            <button
  onClick={() =>
    createPremiumInvoicePDF({
      invoiceNo,
      date: new Date().toLocaleDateString(),
      customerName,
      customerPhone,
      amount: totalAmount,
      status: paymentStatus,
      items: cart,
    })
  }
>
  Download PDF
</button>
          </div>
        </div>
      )}
    </div>
  );
}
function SalesInvoices() {
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editMode, setEditMode] = useState(false);

const [editedName, setEditedName] = useState("");
const [editedPhone, setEditedPhone] = useState("");
const [editedStatus, setEditedStatus] = useState("");
const [invoices, setInvoices] = useState([]);
React.useEffect(() => {
  const fetchInvoices = async () => {
    try {
      const response = await fetch(
        "https://retailiq-backend-tbs4.onrender.com/api/invoices"
      );

      const data = await response.json();

      if (response.ok) {
        setInvoices(data);
      }

    } catch (error) {
      console.log(error);
    }
  };

  fetchInvoices();
}, []);
  
  const filteredInvoices = invoices.filter((invoice) => {
    return (
      invoice.customerName.toLowerCase().includes(search.toLowerCase()) ||
      invoice.invoiceNo.toLowerCase().includes(search.toLowerCase())
    );
  });
  const downloadSavedInvoicePDF = (invoice) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("RetailIQ Invoice", 20, 20);

  doc.setFontSize(12);
  doc.text(`Invoice No: ${invoice.invoiceNo}`, 20, 35);
  doc.text(`Customer: ${invoice.customerName}`, 20, 45);
  doc.text(`Phone: ${invoice.customerPhone}`, 20, 55);
  doc.text(`Status: ${invoice.status}`, 20, 65);
  doc.text(`Date: ${invoice.date}`, 20, 75);

  doc.line(20, 85, 190, 85);

  let y = 100;

  invoice.items?.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.name}`, 20, y);
    doc.text(`Qty: ${item.qty}`, 95, y);
    doc.text(`Price: Rs. ${item.price}`, 125, y);
    doc.text(`Total: Rs. ${item.price * item.qty}`, 160, y);
    y += 10;
  });

  doc.line(20, y + 5, 190, y + 5);

  doc.setFontSize(16);
  doc.text(`Grand Total: Rs. ${invoice.amount}`, 20, y + 20);

  doc.save(`${invoice.invoiceNo}.pdf`);
};
const openEditInvoice = (invoice) => {
  setSelectedInvoice(invoice);

  setEditedName(invoice.customerName);
  setEditedPhone(invoice.customerPhone);
  setEditedStatus(invoice.status);

  setEditMode(true);
};
const deleteInvoice = async (id) => {
  if (!window.confirm("Are you sure you want to delete this invoice?")) {
    return;
  }

  try {
    const response = await fetch(
      `https://retailiq-backend-tbs4.onrender.com/api/invoices/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Invoice deleted successfully");

    setInvoices(
      invoices.filter((invoice) => invoice._id !== id)
    );

  } catch (error) {
    console.log(error);
    alert("Could not delete invoice");
  }
};
const saveInvoiceChanges = async () => {
  try {
    const response = await fetch(
      `https://retailiq-backend-tbs4.onrender.com/api/invoices/${selectedInvoice._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: editedName,
          customerPhone: editedPhone,
          status: editedStatus,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    const updatedInvoices = invoices.map((invoice) =>
      invoice._id === selectedInvoice._id
        ? {
            ...invoice,
            customerName: editedName,
            customerPhone: editedPhone,
            status: editedStatus,
          }
        : invoice
    );

    setInvoices(updatedInvoices);

    setSelectedInvoice({
      ...selectedInvoice,
      customerName: editedName,
      customerPhone: editedPhone,
      status: editedStatus,
    });

    setEditMode(false);

    alert("Invoice updated successfully");

  } catch (error) {
    console.log(error);
    alert("Could not update invoice");
  }
};
  return (
    <div className="sales-page">
      <div className="sales-header">
        <div>
          <h1>Sales Invoices</h1>
          <p>View and manage generated customer invoices.</p>
        </div>

        <Link to="/billing">
          <button className="create-invoice-btn">Create Sales Invoice</button>
        </Link>
      </div>

      <div className="sales-toolbar">
        <input
          type="text"
          placeholder="Search by customer or invoice number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select>
          <option>Last 365 Days</option>
          <option>This Month</option>
          <option>This Week</option>
        </select>
      </div>

      <div className="sales-table-card">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Invoice Number</th>
              <th>Party Name</th>
              <th>Due In</th>
              <th>Amount</th>
              <th>Payment Mode</th>
              <th>Received</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-row">
                  No invoices found.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((invoice) => (
                <tr
  key={invoice._id}
  className="clickable-row"
  onClick={() => setSelectedInvoice(invoice)}
>
                  <td>{invoice.date}</td>
                  <td>{invoice.invoiceNo}</td>
                  <td>{invoice.customerName}</td>
                  <td>-</td>
                  <td>₹{invoice.amount}</td>

<td>{invoice.paymentMode}</td>

<td>₹{invoice.amountReceived}</td>

<td>₹{invoice.balanceAmount}</td>

<td>
  <span className="paid-badge">
    {invoice.status}
  </span>
</td>
                  <td>
                    <button
  className="edit-btn"
  onClick={(e) => {
    e.stopPropagation();
    openEditInvoice(invoice);
  }}
>
  Edit
</button>
  <button
    className="download-btn"
    onClick={(e) => {
      e.stopPropagation();
      createPremiumInvoicePDF(invoice);
    }}
  >
    Download PDF
  </button>

  <button
    className="delete-invoice-btn"
    onClick={(e) => {
      e.stopPropagation();
      deleteInvoice(invoice._id);
    }}
  >
    Delete
  </button>

  <button
    className="print-btn"
    onClick={(e) => {
      e.stopPropagation();
      window.print();
    }}
  >
    Print
  </button>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selectedInvoice && (
  <div className="invoice-modal-overlay">
    <div className="invoice-view-modal">

      <div className="invoice-modal-header">
        <h2>Invoice Details</h2>

        <button onClick={() => setSelectedInvoice(null)}>
          ✕
        </button>
      </div>

      <div className="invoice-info-grid">
        <div>
          <p><strong>Invoice No:</strong> {selectedInvoice.invoiceNo}</p>
          <p><strong>Date:</strong> {selectedInvoice.date}</p>
          {editMode ? (
  <select
    value={editedStatus}
    onChange={(e) => setEditedStatus(e.target.value)}
  >
    <option>Paid</option>
    <option>Pending</option>
    <option>Unpaid</option>
  </select>
) : (
  <p>
    <strong>Status:</strong> {selectedInvoice.status}
  </p>
)}
        </div>

        <div>
          {editMode ? (
  <input
    type="text"
    value={editedName}
    onChange={(e) => setEditedName(e.target.value)}
  />
) : (
  <p>
    <strong>Customer:</strong> {selectedInvoice.customerName}
  </p>
)}
          {editMode ? (
  <input
    type="text"
    value={editedPhone}
    onChange={(e) => setEditedPhone(e.target.value)}
  />
) : (
  <p>
    <strong>Phone:</strong> {selectedInvoice.customerPhone}
  </p>
)}
          <p><strong>Total:</strong> ₹{selectedInvoice.amount}</p>
          <p>
  <strong>Payment Mode:</strong>{" "}
  {selectedInvoice.paymentMode}
</p>

<p>
  <strong>Amount Received:</strong>{" "}
  ₹{selectedInvoice.amountReceived}
</p>

<p>
  <strong>Balance Amount:</strong>{" "}
  ₹{selectedInvoice.balanceAmount}
</p>

<p>
  <strong>Payment Date:</strong>{" "}
  {selectedInvoice.paymentDate}
</p>
        </div>
      </div>

      <h3 className="invoice-items-heading">Invoice Items</h3>

      <table className="invoice-items-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {(selectedInvoice.items || []).map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>₹{item.price}</td>
              <td>₹{item.price * item.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-modal-actions">
        <button
          className="download-btn"
          onClick={() => createPremiumInvoicePDF(selectedInvoice)}
        >
          Download PDF
        </button>
         {editMode && (
  <button className="edit-btn" onClick={saveInvoiceChanges}>
    Save Changes
  </button>
)}
        <button
          className="close-btn"
          onClick={() => setSelectedInvoice(null)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
}
/*------------SalesInvoice----------------*/
function PurchaseInvoices() {
  const token = localStorage.getItem("token");

  const [supplierName, setSupplierName] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");

  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");

  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Paid");

  const [items, setItems] = useState([]);
  const [billFile, setBillFile] = useState(null);
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);
  const [selectedPurchaseInvoice, setSelectedPurchaseInvoice] = useState(null);

  React.useEffect(() => {
    fetchPurchaseInvoices();
  }, []);

  const fetchPurchaseInvoices = async () => {
    try {
      const response = await fetch(
        "https://retailiq-backend-tbs4.onrender.com/api/purchase-invoices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPurchaseInvoices(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  const addItem = () => {
    if (!productName || !brand || !category || !quantity || !purchasePrice) {
      alert("Fill all product details");
      return;
    }

    const newItem = {
      productName,
      brand,
      category,
      quantity: Number(quantity),
      purchasePrice: Number(purchasePrice),
      total: Number(quantity) * Number(purchasePrice),
    };

    setItems((prevItems) => [...prevItems, newItem]);

    setProductName("");
    setBrand("");
    setCategory("");
    setQuantity("");
    setPurchasePrice("");
  };

  const createPurchaseInvoice = async () => {
    if (!supplierName || items.length === 0) {
      alert("Please add supplier and at least one product");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("supplierName", supplierName);
      formData.append("supplierPhone", supplierPhone);
      formData.append("items", JSON.stringify(items));
      formData.append("totalAmount", totalAmount);
      formData.append("paymentMode", paymentMode);
      formData.append("paymentStatus", paymentStatus);
      formData.append("purchaseDate", new Date().toLocaleDateString());

      if (billFile) {
        formData.append("billFile", billFile);
      }

      const response = await fetch(
        "https://retailiq-backend-tbs4.onrender.com/api/purchase-invoices",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Purchase invoice created");

      setSupplierName("");
      setSupplierPhone("");
      setProductName("");
      setBrand("");
      setCategory("");
      setQuantity("");
      setPurchasePrice("");
      setPaymentMode("Cash");
      setPaymentStatus("Paid");
      setBillFile(null);
      setItems([]);

      fetchPurchaseInvoices();
    } catch (error) {
      console.log(error);
      alert("Could not create invoice");
    }
  };
  const deletePurchaseInvoice = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this purchase invoice?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `https://retailiq-backend-tbs4.onrender.com/api/purchase-invoices/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Purchase invoice deleted successfully");

    setSelectedPurchaseInvoice(null);

    fetchPurchaseInvoices();
  } catch (error) {
    console.log(error);

    alert("Could not delete purchase invoice");
  }
};

  return (
    <div className="sales-page">
      <div className="sales-header">
        <div>
          <h1>Purchase Invoices</h1>
          <p>Track products purchased from suppliers.</p>
        </div>

        <Link to="/dashboard">
          <button className="create-invoice-btn">Back to Dashboard</button>
        </Link>
      </div>

      <div className="invoice-shell">
        <div className="invoice-top-grid">
          <div className="invoice-panel">
            <h3>Supplier Details</h3>

            <input
              type="text"
              placeholder="Supplier Name"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Supplier Phone"
              value={supplierPhone}
              onChange={(e) => setSupplierPhone(e.target.value)}
            />
          </div>

          <div className="invoice-panel">
            <h3>Product Details</h3>

            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <input
              type="number"
              placeholder="Purchase Price"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
            />

            <button type="button" onClick={addItem} className="premium-btn">
              + Add Product
            </button>

            <div className="sales-table-card" style={{ marginTop: "20px" }}>
              <h3>Products Added to This Purchase Invoice</h3>

              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-row">
                        No products added yet.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.productName}</td>
                        <td>{item.brand}</td>
                        <td>{item.category}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.purchasePrice}</td>
                        <td>₹{item.total}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="invoice-bottom-grid">
          <div className="invoice-panel">
            <h3>Payment Details</h3>

            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Card</option>
            </select>

            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option>Paid</option>
              <option>Pending</option>
              <option>Unpaid</option>
            </select>

            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setBillFile(e.target.files[0])}
            />
          </div>

          <div className="total-panel">
            <div className="grand-total">
              <span>Total Purchase Amount</span>
              <strong>₹{totalAmount.toFixed(2)}</strong>
            </div>

            <button className="generate-btn" onClick={createPurchaseInvoice}>
              Create Purchase Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="sales-table-card">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Supplier</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {purchaseInvoices.map((invoice) => (
              <tr
  key={invoice._id}
  onClick={() => setSelectedPurchaseInvoice(invoice)}
  style={{ cursor: "pointer" }}
>
                <td>{invoice.purchaseDate}</td>
                <td>{invoice.supplierName}</td>

                <td>
                  {invoice.items?.length
                    ? `${invoice.items.length} products`
                    : invoice.productName}
                </td>

                <td>
                  {invoice.items?.length
                    ? invoice.items.reduce(
                        (sum, item) => sum + Number(item.quantity || 0),
                        0
                      )
                    : invoice.quantity}
                </td>

                <td>
                  {invoice.items?.length
                    ? "Multiple"
                    : `₹${invoice.purchasePrice}`}
                </td>

                <td>₹{invoice.totalAmount}</td>

                <td>
                  <span className="paid-badge">{invoice.paymentStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedPurchaseInvoice && (
  <div className="invoice-modal-overlay">
    <div className="invoice-view-modal">
      <div className="invoice-modal-header">
        <h2>Purchase Invoice Details</h2>

        <button onClick={() => setSelectedPurchaseInvoice(null)}>
          ✕
        </button>
      </div>

      <div className="invoice-info-grid">
        <div>
          <p><strong>Supplier:</strong> {selectedPurchaseInvoice.supplierName}</p>
          <p><strong>Phone:</strong> {selectedPurchaseInvoice.supplierPhone || "-"}</p>
          <p><strong>Date:</strong> {selectedPurchaseInvoice.purchaseDate}</p>
        </div>

        <div>
          <p><strong>Payment Mode:</strong> {selectedPurchaseInvoice.paymentMode}</p>
          <p><strong>Status:</strong> {selectedPurchaseInvoice.paymentStatus}</p>
          <p><strong>Total Amount:</strong> ₹{selectedPurchaseInvoice.totalAmount}</p>
        </div>
      </div>
      {selectedPurchaseInvoice.billFile?.cloudinaryUrl && (
  <div
    style={{
      marginBottom: "20px",
      textAlign: "center",
    }}
  >
    <h3>Uploaded Bill</h3>

    <img
      src={selectedPurchaseInvoice.billFile.cloudinaryUrl}
      alt="Bill"
      style={{
        width: "300px",
        maxWidth: "100%",
        borderRadius: "12px",
        border: "1px solid #ddd",
        cursor: "pointer",
      }}
      onClick={() =>
        window.open(
          selectedPurchaseInvoice.billFile.cloudinaryUrl,
          "_blank"
        )
      }
    />
  </div>
)}
      <h3 className="invoice-items-heading">Purchased Products</h3>

      <table className="invoice-items-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Product</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Purchase Price</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {(selectedPurchaseInvoice.items || []).map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.productName}</td>
              <td>{item.brand}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>₹{item.purchasePrice}</td>
              <td>₹{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
  style={{
    display: "flex",
    gap: "12px",
    marginTop: "20px",
  }}
>
  <button
    className="close-btn"
    onClick={() => setSelectedPurchaseInvoice(null)}
  >
    Close
  </button>

  <button
    className="delete-btn"
    onClick={() => deletePurchaseInvoice(selectedPurchaseInvoice._id)}
    style={{
      background: "#ef4444",
      color: "#fff",
      border: "none",
      padding: "12px 20px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    Delete Invoice
  </button>
</div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}
/*------------Profit Loss-------------*/
function ProfitLoss() {
  const [salesInvoices, setSalesInvoices] = useState([]);
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);

  const token = localStorage.getItem("token");

  React.useEffect(() => {
    fetchSalesInvoices();
    fetchPurchaseInvoices();
  }, []);

  const fetchSalesInvoices = async () => {
    try {
      const response = await fetch("https://retailiq-backend-tbs4.onrender.com/api/invoices");
      const data = await response.json();

      if (response.ok) {
        setSalesInvoices(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPurchaseInvoices = async () => {
    try {
      const response = await fetch(
        "https://retailiq-backend-tbs4.onrender.com/api/purchase-invoices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPurchaseInvoices(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPurchasePrice = (productName) => {
  let matchedPrice = 0;

  purchaseInvoices.forEach((invoice) => {
    if (invoice.items && invoice.items.length > 0) {
      invoice.items.forEach((item) => {
        const purchaseName = item.productName?.toLowerCase().trim();
        const saleName = productName?.toLowerCase().trim();

        if (
          purchaseName === saleName ||
          purchaseName?.includes(saleName) ||
          saleName?.includes(purchaseName)
        ) {
          matchedPrice = Number(item.purchasePrice || 0);
        }
      });
    } else {
      const purchaseName = invoice.productName?.toLowerCase().trim();
      const saleName = productName?.toLowerCase().trim();

      if (
        purchaseName === saleName ||
        purchaseName?.includes(saleName) ||
        saleName?.includes(purchaseName)
      ) {
        matchedPrice = Number(invoice.purchasePrice || 0);
      }
    }
  });

  return matchedPrice;
};

  const productProfitMap = {};

  salesInvoices.forEach((invoice) => {
    invoice.items?.forEach((item) => {
      const name = item.name;
      const qty = Number(item.qty || 1);
      const sellingPrice = Number(item.price || 0);
      const purchasePrice = getPurchasePrice(name);

      if (!productProfitMap[name]) {
        productProfitMap[name] = {
          productName: name,
          soldQty: 0,
          salesAmount: 0,
          purchaseCost: 0,
          profit: 0,
        };
      }

      productProfitMap[name].soldQty += qty;
      productProfitMap[name].salesAmount += sellingPrice * qty;
      productProfitMap[name].purchaseCost += purchasePrice * qty;
      productProfitMap[name].profit += (sellingPrice - purchasePrice) * qty;
      productProfitMap[name].profitPercent =
      productProfitMap[name].purchaseCost > 0
    ? (
        (productProfitMap[name].profit /
          productProfitMap[name].purchaseCost) *
        100
      ).toFixed(2)
    : 0;
    });
  });

  const productProfitData = Object.values(productProfitMap);

  const totalSales = productProfitData.reduce(
    (sum, item) => sum + item.salesAmount,
    0
  );

  const totalSoldPurchaseCost = productProfitData.reduce(
    (sum, item) => sum + item.purchaseCost,
    0
  );

  const grossProfit = productProfitData.reduce(
    (sum, item) => sum + item.profit,
    0
  );
  

  const profitMargin =
    totalSales > 0 ? ((grossProfit / totalSales) * 100).toFixed(2) : 0;

  return (
    <div className="analytics-premium-page">
      <div className="analytics-header">
        <div>
          <h1>Profit & Loss</h1>
          <p>Product-wise profit based on sold quantity.</p>
        </div>

        <Link to="/dashboard">
          <button className="back-btn">Back to Dashboard</button>
        </Link>
      </div>

      <div className="analytics-cards">
        <div className="analytics-card paid">
          <h3>Total Sales Revenue</h3>
          <h1>₹{totalSales.toFixed(2)}</h1>
        </div>

        <div className="analytics-card pending">
          <h3>Cost of Sold Products</h3>
          <h1>₹{totalSoldPurchaseCost.toFixed(2)}</h1>
        </div>

        <div className="analytics-card">
          <h3>Gross Profit</h3>
          <h1>₹{grossProfit.toFixed(2)}</h1>
        </div>

        <div className="analytics-card">
          <h3>Profit Margin</h3>
          <h1>{profitMargin}%</h1>
        </div>
      </div>

      <div className="sales-table-card">
        <h2>Product-wise Profit</h2>

        <table className="sales-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Sold Qty</th>
              <th>Cost Price / Unit</th>
              <th>Selling Amount</th>
              <th>Total Cost</th>
              <th>Profit</th>  
              <th>Profit %</th>                                           
            </tr>
          </thead>

          <tbody>
            {productProfitData.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-row">
                  No sold products found.
                </td>
              </tr>
            ) : (
              productProfitData.map((item) => (
                <tr key={item.productName}>
                  <td>{item.productName}</td>
                  <td>{item.soldQty}</td>
                  <td>₹{item.soldQty > 0 ? (item.purchaseCost / item.soldQty).toFixed(2): "0.00"}</td>
                  <td>₹{item.salesAmount.toFixed(2)}</td>
                  <td>₹{item.purchaseCost.toFixed(2)}</td>
                  <td>₹{item.profit.toFixed(2)}</td>
                  <td>{item.profitPercent}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default App;

/*---------------Profile Page -------------------*/
import axios from "axios";

function Profile() {
  const [form, setForm] = useState({
    shopName: "",
    gstin: "",
    email: "",
    address: "",
    website: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifsc: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get("https://YOUR-BACKEND-URL.onrender.com/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm({
        shopName: res.data.shopName || "",
        gstin: res.data.gstin || "",
        email: res.data.email || "",
        address: res.data.address || "",
        website: res.data.website || "",
        bankName: res.data.bankName || "",
        accountName: res.data.accountName || "",
        accountNumber: res.data.accountNumber || "",
        ifsc: res.data.ifsc || "",
      });
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
      "https://YOUR-BACKEND-URL.onrender.com/api/profile",
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Profile saved successfully");
  };

  return (
    <div className="profile-page">
      <h2>Business Profile</h2>

      <input name="shopName" placeholder="Shop Name" value={form.shopName} onChange={handleChange} />
      <input name="gstin" placeholder="GSTIN" value={form.gstin} onChange={handleChange} />
      <input name="email" placeholder="Business Email" value={form.email} onChange={handleChange} />
      <input name="address" placeholder="Shop Address" value={form.address} onChange={handleChange} />
      <input name="website" placeholder="Website" value={form.website} onChange={handleChange} />

      <h3>Bank Details</h3>

      <input name="accountName" placeholder="Account Holder Name" value={form.accountName} onChange={handleChange} />
      <input name="accountNumber" placeholder="Account Number" value={form.accountNumber} onChange={handleChange} />
      <input name="ifsc" placeholder="IFSC Code" value={form.ifsc} onChange={handleChange} />
      <input name="bankName" placeholder="Bank Name" value={form.bankName} onChange={handleChange} />

      <button onClick={saveProfile}>Save Profile</button>
    </div>
  );
}

export default Profile;