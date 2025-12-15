import React from 'react'
import {useNavigate, Link } from 'react-router-dom'
import './navbar.css'
import api from '../api'

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async()=>{
    try {
      const res = await api.post("/logout",{withCredentials:true});
      console.log(res.data);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='navbar'>
        <div className="logo">
            <h1>Admin Portal</h1>
        </div>
        <div className="menus">
            <Link to="/admin">Home</Link>
            <Link to="/admin/newtask">new task</Link>
            <Link to="/admin/alltask">All task</Link>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Navbar