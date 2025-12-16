import React,{useState} from 'react'
import {useNavigate, Link } from 'react-router-dom'
import './navbar.css'
import api from '../api'

function NavbarAdmin() {
  const navigate = useNavigate();

  const handleLogout = async()=>{
    try {
      const res = await api.post("/auth/logout");
      console.log(res.data);
      navigate("/login-admin");
    } catch (error) {
      console.log(error);
    }
  }

  

  return (
    <div className='navbar'>
        <div className="logo">
            <h1>TaskFlow</h1>
        </div>
        <div className="menus">
            <Link to="/admin"><i class="fa-solid fa-plus"></i> Dashboard</Link>
            <Link to="/admin/alltask"><i class="fa-solid fa-voicemail"></i> Tasks</Link>
            {/* <Link to="/admin/users"><i class="fa-solid fa-users"></i> Users</Link>
            <Link to="/admin/settings"><i class="fa-solid fa-gears"></i>Settings</Link> */}
        </div>
        
            {/* <div className="footer">
            
                <div className="image-icon">
                    <img src="/employee.png" alt="" />
                </div>
                <div className="name-plate">
                    <h4>Ankit Kumar</h4>
                    <p>Project Manager</p>
                </div>
            </div> */}
              <button className="logout-btn" style={{
                marginBottom: "70px",
                width:"110px",
  padding: "10px 20px",
  backgroundColor: "#d9534f",
  border: "none",
  borderRadius: "5px",
  color: "white",
  fontSize: "0.9rem",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  textAlign:"center"
              }} onClick={handleLogout}>Logout</button>
       
    </div>
  )
}

export default NavbarAdmin;