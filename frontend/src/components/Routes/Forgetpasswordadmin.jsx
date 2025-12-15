import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import "./loginadmin.css";
function Forgetpasswordadmin() {
  const [formData, setFormData] = useState({ username: "", password: "",role:"admin" });
  const navigate = useNavigate();
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
  };

  return (

<div className="admin-login-page">
      <div className="login-card">
        <h3 className="login-heading">retrive password</h3>

        <form onSubmit={handleSubmit} className="login-form">
          <label>Email</label>
          <input
            type="text"
            name="username"
            placeholder="username@gmail.com"
            value={formData.username}
            onChange={handleChange}
            required
          />

          


          <button type="submit" className="login-btn">set password</button>
          <Link to={"/login-admin"} className="forgot-link">login</Link>
        </form>

      </div>
    </div>
  );

}

export default Forgetpasswordadmin;
