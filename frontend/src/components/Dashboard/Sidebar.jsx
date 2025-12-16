import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import api from '../../api';
import './Sidebar.css';

function Sidebar({ activeView, onViewChange }) {
  const { user, setUser, setToken } = useUser();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      setToken(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails on server, clear local state
      setUser(null);
      setToken(null);
      navigate("/");
    }
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(prev => !prev);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <h2>Employee Portal</h2>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => onViewChange('dashboard')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </button>
        
        <button
          className={`nav-item ${activeView === 'create-task' ? 'active' : ''}`}
          onClick={() => onViewChange('create-task')}
        >
          <span className="nav-icon">➕</span>
          <span className="nav-text">Create Task</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar" onClick={toggleProfileMenu}>
            <img src="/employee.png" alt="User Avatar" />
          </div>
          <div className="user-info" onClick={toggleProfileMenu}>
            <div className="user-name">
              {user ? user.name.toUpperCase() : 'GUEST'}
            </div>
            <div className="user-role">Employee</div>
          </div>
          
          {showProfileMenu && (
            <div className="profile-menu">
              <button className="logout-btn" onClick={handleLogout}>
                <span className="logout-icon">🚪</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;