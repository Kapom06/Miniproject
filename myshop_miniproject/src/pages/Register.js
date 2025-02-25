import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", { fullName, email, password });
      alert("✅ Registration successful!");
      navigate("/login");
    } catch (err) {
      alert("❌ Error registering. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes floatAnimation {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }

        @keyframes glowAnimation {
          0% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.5); }
          50% { box-shadow: 0 0 40px rgba(255, 0, 0, 0.8); }
          100% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.5); }
        }
        `}
      </style>
      <motion.div
        style={styles.registerBox}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={styles.title}>Create Your Account</h2>
        <form onSubmit={handleRegister}>
          <div style={styles.inputContainer}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

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
  registerBox: {
    position: "relative",
    background: "rgba(40, 0, 0, 0.8)",
    padding: "2.5rem",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(255, 0, 0, 0.5)",
    maxWidth: "400px",
    width: "90%",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 0, 0, 0.3)",
    animation: "floatAnimation 4s ease-in-out infinite, glowAnimation 3s ease-in-out infinite",
  },
  title: {
    color: "#ffffff",
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    textShadow: "0px 0px 10px rgba(255, 0, 0, 0.5)",
  },
  inputContainer: {
    marginBottom: "1.5rem",
  },
  input: {
    width: "100%",
    padding: "12px",
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
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#8b0000",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0px 4px 15px rgba(255, 0, 0, 0.5)",
  },
};

export default Register;