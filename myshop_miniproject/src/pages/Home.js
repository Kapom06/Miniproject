import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

function Home() {
  return (
    <div style={styles.container}>
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
      {[...Array(10)].map((_, i) => (
        <div key={i} className="meteor" style={{
          top: `${Math.random() * 100}vh`,
          left: `${Math.random() * 100}vw`,
          animationDelay: `${Math.random() * 2}s`,
        }}></div>
      ))}
      <motion.div
        style={styles.homeBox}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}  
        transition={{ duration: 0.5 }}
      >
        <h1 style={styles.title}>Welcome to Kapom Shop</h1>
        <p style={styles.subtitle}>Your one-stop shop for amazing products at unbeatable prices.</p>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link to="/products" style={styles.button}>Start Shopping</Link>
        </motion.div>
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
  homeBox: {
    position: "relative",
    background: "rgba(40, 0, 0, 0.8)",
    padding: "3rem",
    borderRadius: "20px",
    boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)",
    maxWidth: "500px",
    width: "90%",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 0, 0, 0.3)",
    animation: "glowAnimation 3s ease-in-out infinite",
  },
  title: {
    color: "#ffffff",
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    textShadow: "0px 0px 10px rgba(255, 0, 0, 0.5)",
  },
  subtitle: {
    color: "#ccccff",
    fontSize: "1.2rem",
    marginBottom: "2rem",
  },
  button: {
    display: "inline-block",
    backgroundColor: "#8b0000",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "bold",
    textDecoration: "none",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0px 4px 10px rgba(255, 0, 0, 0.5)",
  },
};

export default Home;