import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/api/products", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => setProducts(res.data.products))
        .catch(() => setError("Unauthorized access. Please login."));
    }, [token]);

    const handleQuantityChange = (productID, value) => {
        setQuantity((prev) => ({ ...prev, [productID]: value }));
    };

    const handleAddToCart = async (product) => {
        const selectedQuantity = quantity[product.ProductID] || 1;
        try {
            const cartData = { 
                ProductID: product.ProductID, 
                Quantity: selectedQuantity, 
                CustomerID: 4 // เปลี่ยนเป็นค่าที่ดึงจาก Auth ได้ถ้าต้องการ
            };

            console.log("📦 Adding to Cart:", cartData);

            const response = await axios.post(
                "http://localhost:5000/api/cart",
                cartData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.status === "success") {
                setSuccess("✅ Item added to cart!");
                setTimeout(() => navigate("/cart"), 1000); // ✅ นำทางไปยัง Cart หลังจากเพิ่มสำเร็จ
            } else {
                setError("❌ Failed to add item to cart.");
            }
        } catch (err) {
            setError("❌ Error adding item to cart.");
        }

        setTimeout(() => {
            setSuccess("");
            setError("");
        }, 2000);
    };

    return (
        <motion.div 
            className="container my-5 p-4 rounded shadow-lg"
            style={styles.container}
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-center fw-bold mb-4" style={styles.title}>🛍 Our Products</h2>

            {success && <p className="alert alert-success text-center">{success}</p>}
            {error && <p className="alert alert-danger text-center">{error}</p>}

            <div className="row">
                {products.map((p) => (
                    <div key={p.ProductID} className="col-lg-4 col-md-6 mb-4">
                        <motion.div 
                            className="card shadow-sm p-3 border-0"
                            style={styles.card}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="card-body text-center">
                                <h5 className="fw-bold" style={styles.productName}>{p.ProductName}</h5>
                                <p className="text-muted" style={styles.description}>{p.Description}</p>
                                <p className="fw-bold fs-5" style={styles.price}>{parseFloat(p.Price).toLocaleString()} บาท</p>
                                
                                <div className="mb-3">
                                    <label className="form-label" style={styles.label}>Quantity:</label>
                                    <input 
                                        type="number" 
                                        className="form-control text-center" 
                                        value={quantity[p.ProductID] || 1} 
                                        min="1"
                                        onChange={(e) => handleQuantityChange(p.ProductID, parseInt(e.target.value))}
                                        style={styles.input}
                                    />
                                </div>

                                <motion.button 
                                    className="btn w-100"
                                    style={styles.button}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleAddToCart(p)}
                                >
                                    🛒 Add to Cart
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const styles = {
    container: {
        background: "rgba(40, 0, 0, 0.8)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 0, 0, 0.3)",
        boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)",
    },
    title: {
        color: "#ffffff",
        textShadow: "0px 0px 10px rgba(255, 0, 0, 0.5)",
        fontSize: "2.5rem",
    },
    card: {
        background: "rgba(255, 64, 64, 0.23)",
        border: "1px solid rgba(255, 0, 0, 0.3)",
        borderRadius: "12px",
        backdropFilter: "blur(5px)",
    },
    productName: {
        color: "#ffffff",
        textShadow: "0px 0px 10px rgba(255, 0, 0, 0.5)",
        fontSize: "1.5rem",
    },
    description: {
        color: "#cccccc",
        fontSize: "1rem",
    },
    price: {
        color: "#ff6666",
        textShadow: "0px 0px 10px rgba(255, 0, 0, 0.5)",
        fontSize: "1.25rem",
    },
    label: {
        color: "#ffffff",
        fontSize: "1rem",
    },
    input: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 0, 0, 0.3)",
        color: "#ffffff",
        fontSize: "1rem",
    },
    button: {
        backgroundColor: "#8b0000",
        color: "#ffffff",
        border: "none",
        boxShadow: "0px 4px 10px rgba(255, 0, 0, 0.5)",
        fontSize: "1rem",
    },
};

export default Products;