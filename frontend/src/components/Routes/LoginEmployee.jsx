import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import "./login.css";
import { useUser } from "../../context/UserContext";

function LoginEmployee() {
  const [formData, setFormData] = useState({
    email: "pooja04@gmail.com",
    password: "123456",
    role: "employee",
  });

  const [loading, setLoading] = useState(false); // ✅ loading state

  const navigate = useNavigate();
  const { setUser, setToken } = useUser();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    localStorage.clear();
    setLoading(true); // ✅ start loading

    try {
      const res = await api.post("/auth/login", formData);
      const { token, user } = res.data;

      setUser(user);
      setToken(token);

      setFormData({ email: "", password: "" });

      navigate("/employee");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <div className="login-container">
      <div className="form-panel">
        <div className="login-box">
          <h1>Employee Login</h1>

          <form onSubmit={handleSubmit} className="form">
            <label>Email</label>
            <input
              type="email"
              placeholder="employee@gmail.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="login-footer">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        </div>

        <button
          className="login-box-btn"
          onClick={() => navigate("/login-admin")}
          disabled={loading}
        >
          Login As Administrator
        </button>
      </div>
    </div>
  );
}

export default LoginEmployee;
