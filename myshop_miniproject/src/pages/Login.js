import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                login(data.token);
                navigate("/");
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError("Login failed. Try again.");
        }
    };

    return (
        <div style={styles.container}>
            {/* CSS Animation */}
            <style>
                {`
                @keyframes gradientAnimation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                @keyframes meteorAnimation {
                    0% { transform: translateY(-100vh) translateX(50vw) rotate(45deg); opacity: 1; }
                    100% { transform: translateY(100vh) translateX(-50vw) rotate(45deg); opacity: 0; }
                }

                @keyframes glowAnimation {
                    0% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.5); }
                    50% { box-shadow: 0 0 40px rgba(255, 0, 0, 0.8); }
                    100% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.5); }
                }
                
                .meteor {
                    position: absolute;
                    width: 3px;
                    height: 40px;
                    background: rgba(255, 0, 0, 0.7);
                    opacity: 0.7;
                    filter: blur(1px);
                    animation: meteorAnimation 2s linear infinite;
                }
                `}
            </style>

            {/* ✅ ดาวตก */}
            {[...Array(10)].map((_, i) => (
                <div key={i} className="meteor" style={{
                    top: `${Math.random() * 100}vh`,
                    left: `${Math.random() * 100}vw`,
                    animationDelay: `${Math.random() * 2}s`,
                }}></div>
            ))}

            <motion.div 
                style={styles.loginBox}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 style={styles.title}>Sign In</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleLogin}>
                    <div style={styles.inputContainer}>
                        <input 
                            type="email" 
                            placeholder="Email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputContainer}>
                        <input 
                            type="password" 
                            placeholder="Password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                            style={styles.input}
                        />
                    </div>
                    <motion.button 
                        type="submit"
                        style={styles.button}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95, backgroundColor: "#8b0000" }}
                    >
                        Sign In
                    </motion.button>
                </form>
                <p style={styles.signupText}>
                    New here? <a href="/register" style={styles.link}>Sign up now</a>
                </p>
            </motion.div>
        </div>
    );
};

const styles = {
    container: {
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "linear-gradient(-45deg, #8b0000, #ff2400, #8b0000, #ff2400)",
        backgroundSize: "400% 400%",
        animation: "gradientAnimation 10s ease infinite",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    loginBox: {
        position: "relative",
        background: "rgba(40, 0, 0, 0.8)",
        padding: "3rem",
        borderRadius: "20px",
        boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)",
        maxWidth: "400px",
        width: "90%",
        textAlign: "center",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 0, 0, 0.3)",
        animation: "glowAnimation 3s ease-in-out infinite",
    },
    title: {
        color: "#ffffff",
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "1.5rem",
        textShadow: "0px 0px 10px rgba(255, 0, 0, 0.5)",
    },
    inputContainer: {
        marginBottom: "1rem",
    },
    input: {
        width: "100%",
        padding: "14px",
        borderRadius: "10px",
        border: "1px solid rgba(255, 0, 0, 0.3)",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        color: "#fff",
        fontSize: "1rem",
        outline: "none",
        transition: "all 0.3s",
    },
    button: {
        width: "100%",
        padding: "14px",
        borderRadius: "10px",
        border: "none",
        backgroundColor: "#8b0000",
        color: "#fff",
        fontSize: "1rem",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        boxShadow: "0px 4px 10px rgba(255, 0, 0, 0.5)",
    },
    signupText: {
        color: "#ccccff",
        marginTop: "1rem",
        fontSize: "0.9rem",
    },
    link: {
        color: "#ff6666",
        textDecoration: "none",
        fontWeight: "bold",
        transition: "color 0.3s",
    },
    error: {
        color: "#ff6666",
        marginBottom: "1rem",
        fontSize: "0.9rem",
    },
};

export default Login;