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

  const navigate = useNavigate();
  const { setUser, setToken } = useUser();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    localStorage.clear();
    try {
      const res = await api.post("/auth/login", formData);
      const { token, user } = res.data;

      // localStorage.setItem("token", token);
      // localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setToken(token);

      // Clear form
      setFormData({ email: "", password: "" });

      // Navigate based on role
        navigate("/employee");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <div className="form-panel">
        <div className="login-box">
          <h1>Employee Login</h1>
          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="employee@gmail.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="login-btn">Login</button>
          </form>

          <div className="login-footer">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        </div>

        <button
          className="login-box-btn"
          onClick={() => navigate("/login-admin")}
        >
          Login As Administrator
        </button>
      </div>

      {/* <div className="image-panel">
        <img src="/employeelogin.png" alt="Login Illustration" />
      </div> */}
    </div>
  );
}

export default LoginEmployee;
