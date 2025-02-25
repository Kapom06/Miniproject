import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import OrderTracking from "./pages/OrderTracking";
import { AuthContext } from "./AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
    }, []);

    const updateCart = (updatedCart) => {
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const addToCart = (product) => {
        let updatedCart;
        const existingItem = cart.find(item => item.ProductID === product.ProductID);

        if (existingItem) {
            updatedCart = cart.map(item =>
                item.ProductID === product.ProductID
                    ? { ...item, Quantity: item.Quantity + 1 }
                    : item
            );
        } else {
            updatedCart = [...cart, { ...product, Quantity: 1 }];
        }

        updateCart(updatedCart);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="App">
            {/* ✅ Navbar Bootstrap with enhanced UI */}
            <nav className="navbar navbar-expand-lg navbar-dark custom-navbar shadow-sm">
                <div className="container">
                    <Link className="navbar-brand fw-bold text-light" to="/">🛒 Kapom Shop</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item"><Link className="nav-link text-light" to="/">🏠 Home</Link></li>
                            {user ? (
                                <>
                                    <li className="nav-item"><Link className="nav-link text-light" to="/products">🛍 Products</Link></li>
                                    <li className="nav-item"><Link className="nav-link text-light" to="/orders">📦 Orders</Link></li>
                                    <li className="nav-item"><Link className="nav-link text-light" to="/payment">💳 Payment</Link></li>
                                    <li className="nav-item"><Link className="nav-link text-light" to="/cart">🛒 Cart ({cart.reduce((acc, item) => acc + item.Quantity, 0)})</Link></li>
                                    <li className="nav-item"><Link className="nav-link text-light" to="/order-tracking">🚚 Order Tracking</Link></li>
                                    <li className="nav-item">
                                        <button onClick={handleLogout} className="btn btn-danger btn-sm ms-3">🚪 Logout</button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item"><Link className="nav-link text-light" to="/login">🔑 Login</Link></li>
                                    <li className="nav-item"><Link className="btn btn-primary btn-rounded px-4 ms-3" to="/register">📝 Register</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* ✅ Routes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products addToCart={addToCart} />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/cart" element={<Cart cart={cart} setCart={updateCart} />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-tracking" element={<OrderTracking />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    );
}

export default App;

/* App.css */

