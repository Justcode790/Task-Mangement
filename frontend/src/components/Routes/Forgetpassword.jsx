import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import "./login.css";
import { useUser } from '../../context/UserContext';

function Forgetpassword() {
  const [formData, setFormData] = useState({ username: "", password: "",role:"employee" });
  const { setUser } = useUser();   

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  };

  return (
    <div className="login-container">
      
      <div className="form-panel">
        <div className="login-box">
          <h1>Creditendials retrival</h1>
          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="username">email</label>
            <input
              type="email"
              placeholder="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <button type="submit">submit</button>
          </form>
          <div className="login-footer">
            <Link to="/">Login</Link>
          </div>
        </div>
      </div>
      <div className="image-panel">
        <img src="/employeelogin.png" alt="Login Illustration" />
      </div>
    </div>
  );
}

export default Forgetpassword;
