import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import "./loginadmin.css";
import { useUser } from "../../context/UserContext";

function Loginadmin() {
  const [formData, setFormData] = useState({
    email: "ankit@gmail.com",
    password: "123456",
    role: "admin",
  });

  const navigate = useNavigate();
  const { setUser, setToken } = useUser(); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);

      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      setUser(user);
      setToken(token);

      setFormData({ email: "", password: "" });

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "employee") navigate("/employee");
      else navigate("/");

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <button 
          className="back-btn"
          onClick={() => navigate("/")}
          type="button"
        >
          ← Back to Employee Login
        </button>
        <h3 className="login-heading">Admin Login</h3>

        <form onSubmit={handleSubmit} className="login-form">
          <label>Email</label>
          <input
            type="text"
            name="email"
            placeholder="admin@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="*******"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <Link to="/forgot-password-admin" className="forgot-link">
            Forgot Password?
          </Link>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="signup-text">
          Don’t have an account yet? <Link to="/signup">Register for free</Link>
        </p>
      </div>
    </div>
  );
}

export default Loginadmin;
