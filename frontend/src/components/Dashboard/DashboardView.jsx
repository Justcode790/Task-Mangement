import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import api from '../../api';
import './DashboardView.css';

function DashboardView() {
  const [allTasks, setAllTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

useEffect(() => {
  const fetchAllTasks = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [activeRes, completedRes, notificationRes] = await Promise.all([
        api.get("/employee/task/active"),
        api.get("/employee/task/completed"),
        api.get("/employee/task/notification")
      ]);

      console.log(activeRes);

      // Combine ONLY active + completed tasks
      const activeTasks = activeRes.data || [];
      const completedTasks = completedRes.data || [];
      const notificationTasks = notificationRes.data || [];

      const allTasksData = [...activeTasks, ...completedTasks];

      // Filter tasks assigned to current user
      const userTasks = allTasksData.filter(
        (task) =>
          task.assignedTo &&
          String(task.assignedTo._id) === String(user._id)
      );

      // Mark tasks as new if they appear in notifications
      const tasksWithNotifications = userTasks.map(task => ({
        ...task,
        isNew: notificationTasks.some(notif => notif._id === task._id)
      }));

      // Sort by creation date (newest first)
      const sortedTasks = tasksWithNotifications.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setAllTasks(activeTasks);
      setNotifications(notificationTasks);

    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks");
      if (err.response?.status === 401) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchAllTasks();
}, [user, navigate]);


  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#ff9800';
      case 'completed':
        return '#4caf50';
      // case 'rejected':
      //   return '#f44336';
      // case 'new':
      //   return '#007bff';
      // default:
      //   return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      // case 'rejected':
      //   return 'Rejected';
      // case 'new':
      //   return 'New';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  // const handleNotificationAction = async (taskId, action) => {
  //   try {
  //     await api.put(`/task/status/${taskId}`, { status: action }, { withCredentials: true });
      
  //     // Remove from notifications
  //     setNotifications(prev => prev.filter(notif => notif._id !== taskId));
      
  //     // Update task status in allTasks
  //     setAllTasks(prev => prev.map(task => 
  //       task._id === taskId 
  //         ? { ...task, isNew: false, status: action === 'accept' ? 'active' : 'rejected' }
  //         : task
  //     ));
      
  //     // Close popup if no more notifications
  //     if (notifications.length <= 1) {
  //       setShowNotificationPopup(false);
  //     }
  //   } catch (error) {
  //     console.error("Error updating task status:", error);
  //   }
  // };

  const handleMarkAsRead = async (taskId) => {
  try {
    await api.put(`/employee/task/read/${taskId}`);

    // Remove from notifications list
    setNotifications(prev =>
      prev.filter(notif => notif._id !== taskId)
    );

    // Update task list → remove "NEW" tag
    setAllTasks(prev =>
      prev.map(task =>
        task._id === taskId
          ? { ...task, isNew: false }
          : task
      )
    );

    // Close popup if empty
    if (notifications.length <= 1) {
      setShowNotificationPopup(false);
    }
  } catch (err) {
    console.error("Failed to mark notification as read", err);
  }
};

  if (loading) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-header">
          <h1>My Tasks</h1>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-header">
          <h1>My Tasks</h1>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-view">
      <div className="dashboard-header">
        <h1>My Tasks</h1>
        <div className="header-actions">
          <div className="task-summary">
            <span className="task-count">{allTasks.length} Total Tasks</span>
            <span className="active-count">
              {allTasks.filter(task => task.status === 'active').length} Active
            </span>
          </div>
          {notifications.length > 0 && (
            <button 
              className="notification-btn"
              onClick={() => setShowNotificationPopup(true)}
            >
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">{notifications.length}</span>
              New Tasks
            </button>
          )}
        </div>
      </div>

      <div className="tasks-container">
        {allTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Tasks Assigned</h3>
            <p>You don't have any tasks assigned yet. Check back later or create your own tasks.</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {allTasks.map((task) => (
              
              <div key={task._id} className={`task-card ${task.isNew ? 'task-new' : ''}`}>
                {/* {console.log(task)} */}
                {task.isNew && <div className="new-task-indicator">NEW</div>}
                <div className="task-header">
                  <div className="task-title">{task.title}</div>
                  <div 
                    className="task-status"
                    style={{ backgroundColor: getStatusColor(task.status) }}
                  >
                    {getStatusText(task.status)}
                  </div>
                </div>
                
                <div className="task-description">
                  {task.description}
                </div>
                
                <div className="task-footer">
                  <div className="task-meta">
                    <div className="assigned-by">
                      <span className="meta-label">Assigned by:</span>
                      <span className="meta-value">{task.createdBy?.name || 'Unknown'}</span>
                    </div>
                    <div className="created-date">
                      <span className="meta-label">Created:</span>
                      <span className="meta-value">{formatDate(task.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notification Popup */}
      {showNotificationPopup && (
        <div className="notification-overlay">
          <div className="notification-popup">
            <div className="notification-header">
              <h2>New Task Assignments</h2>
              <button 
                className="close-btn"
                onClick={() => setShowNotificationPopup(false)}
              >
                ✕
              </button>
            </div>
            <div className="notification-body">
              {notifications.length === 0 ? (
                <p className="no-notifications">No new notifications</p>
              ) : (
                notifications.map((task) => (
                  <div key={task._id} className="notification-card">
                    <div className="notification-content">
                      <h4>{task.title}</h4>
                      <p>{task.description || "No description provided"}</p>
                      <span className="notification-date">
                        Assigned on: {formatDate(task.createdAt || task.date)}
                      </span>
                    </div>
                    <div className="notification-actions">
                      <button
                        className="mark-read-btn"
                        onClick={() => handleMarkAsRead(task._id)}
                      >
                        Mark as Read
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardView;