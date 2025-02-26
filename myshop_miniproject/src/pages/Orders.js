import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import axios from "axios";

const OrdersAndPayment = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderID, setSelectedOrderID] = useState("");
    const [orderDetails, setOrderDetails] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    // ✅ โหลดรายการ Order ทั้งหมดของลูกค้า
    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/orders/1", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.orders.length > 0) {
                setOrders(response.data.orders);
            } else {
                setError("No orders found.");
            }
        } catch (err) {
            console.error("Fetch Orders Error:", err);
            setError("Failed to fetch orders.");
        }
    };

    // ✅ โหลดข้อมูล Order ตาม OrderID ที่เลือก
    const fetchOrderDetails = async (orderID) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/orders/order/${orderID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.OrderID) {
                setOrderDetails(response.data);
                setError("");
            } else {
                setError("Order not found.");
                setOrderDetails(null);
            }
        } catch (err) {
            console.error("Fetch Order Error:", err);
            setError("Failed to fetch order details.");
        }
    };

    // ✅ ฟังก์ชันชำระเงินและบันทึกลง SQL
    const handlePayment = async () => {
        if (!selectedOrderID) {
            alert("Please select an Order!");
            return;
        }
        if (!paymentMethod) {
            alert("Please select a payment method!");
            return;
        }

        const paymentData = {
            OrderID: selectedOrderID,
            PaymentMethod: paymentMethod,
            Amount: orderDetails.TotalPrice,
            PaymentDate: new Date().toISOString().slice(0, 19).replace("T", " "), 
            Status: "Completed"
        };

        try {
            const response = await axios.post("http://localhost:5000/api/payments", paymentData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Payment Response:", response.data);

            if (response.data.status === "success") {
                alert("Payment Successful!");

                // ✅ อัปเดตสถานะออเดอร์เป็น Completed
                await axios.put(`http://localhost:5000/api/orders/${selectedOrderID}`, { Status: "Completed" }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // ✅ โหลดข้อมูลออเดอร์ใหม่หลังชำระเงิน
                fetchOrders();
                fetchOrderDetails(selectedOrderID);
            } else {
                setError("Failed to complete payment.");
            }
        } catch (err) {
            console.error("Payment Error:", err);
            setError("Error processing payment.");
        }
    };

    return (
        <motion.div 
            className="container my-5 p-4 rounded shadow-lg"
            style={styles.container}
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-center fw-bold mb-4" style={styles.title}>📦 Order & Payment</h2>

            {error && <p className="alert alert-danger text-center">{error}</p>}

            {/* ✅ Dropdown เลือก Order */}
            <div className="mb-4">
                <label className="fw-bold" style={styles.label}>Select Order ID:</label>
                <select 
                    className="form-select"
                    value={selectedOrderID}
                    onChange={(e) => {
                        setSelectedOrderID(e.target.value);
                        fetchOrderDetails(e.target.value);
                    }}
                    style={styles.input}
                >
                    <option value="">-- Select Order --</option>
                    {orders.map((order) => (
                        <option key={order.OrderID} value={order.OrderID}>
                            Order {order.OrderID} - {new Date(order.OrderDate).toLocaleString()}
                        </option>
                    ))}
                </select>
            </div>

            {/* ✅ แสดงรายละเอียด Order */}
            {orderDetails && (
                <>
                    <div className="p-3 mb-4 rounded shadow-sm" style={styles.orderDetails}>
                        <h4 className="text-center text-dark fw-bold">Order Information</h4>
                        <p className="mb-1"><strong>Order ID:</strong> {orderDetails.OrderID}</p>
                        <p className="mb-1"><strong>Total Price:</strong> {parseFloat(orderDetails.TotalPrice).toLocaleString()} บาท</p>
                        <p className="mb-1">
                            <strong>Status:</strong> 
                            <span className="badge ms-2" style={getStatusStyle(orderDetails.Status)}>
                                {orderDetails.Status}
                            </span>
                        </p>
                    </div>

                    {/* ✅ เลือกวิธีชำระเงิน */}
                    {orderDetails.Status !== "Completed" ? (
                        <>
                            <p className="text-center text-muted">Please select your preferred payment method:</p>
                            <div className="d-flex flex-column gap-3 my-4">
                                {["Credit Card", "PayPal", "Bank Transfer"].map((method) => (
                                    <motion.label 
                                        key={method} 
                                        className="d-flex align-items-center p-3 rounded border"
                                        whileHover={{ scale: 1.05, backgroundColor: "#f1faee" }}
                                        transition={{ duration: 0.3 }}
                                        style={styles.option}
                                    >
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            value={method}
                                            className="me-2"
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        /> 
                                        {method === "Credit Card" ? "💳" : method === "PayPal" ? "🅿️" : "🏦"} {method}
                                    </motion.label>
                                ))}
                            </div>

                            {/* ✅ ปุ่มชำระเงิน */}
                            <div className="d-flex justify-content-center mt-4">
                                <motion.button 
                                    className="btn btn-lg"
                                    style={styles.btnPayment}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handlePayment}
                                >
                                    Complete Payment
                                </motion.button>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-success fw-bold">✅ This order has already been paid.</p>
                    )}
                </>
            )}
        </motion.div>
    );
};

// ✅ ฟังก์ชันกำหนดสีของสถานะ Order
const getStatusStyle = (status) => ({
    backgroundColor: status === "Completed" ? "#2a9d8f" : "#f4a261",
    color: "white", padding: "8px 12px", borderRadius: "5px"
});

const styles = {
    container: {
        background: "rgba(40, 0, 0, 0.8)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 0, 0, 0.3)",
        boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)",
        maxWidth: "600px",
        margin: "auto",
        padding: "20px",
        borderRadius: "12px",
    },
    title: {
        color: "#ffffff",
        textShadow: "0px 0px 10px rgba(255, 0, 0, 0.5)",
        fontSize: "2.5rem",
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
    orderDetails: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 0, 0, 0.3)",
        borderRadius: "10px",
        padding: "15px",
        color: "#ffffff",
    },
    option: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 0, 0, 0.3)",
        color: "#ffffff",
        fontSize: "1.2rem",
        cursor: "pointer",
        transition: "0.3s",
    },
    btnPayment: {
        backgroundColor: "#8b0000",
        color: "#ffffff",
        padding: "12px 20px",
        borderRadius: "10px",
        fontSize: "1.2rem",
        transition: "0.3s",
        border: "none",
        cursor: "pointer",
        boxShadow: "0px 4px 10px rgba(255, 0, 0, 0.5)",
    }
};

export default OrdersAndPayment;