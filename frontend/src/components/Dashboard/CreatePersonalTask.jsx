import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import api from '../../api';
import './CreatePersonalTask.css';

function CreatePersonalTask() {
  const { user } = useUser();
  const [task, setTask] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
    
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setMessage({ type: 'error', text: 'User not authenticated' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Create task assigned to self
      const taskData = {
        title: task.title,
        description: task.description,
        assignedTo: user._id, // Assign to self
        
        dueDate: new Date(Date.now()).toISOString().split('T')[0] // Default 7 days from now
      };

      await api.post('/task', taskData);
      
      setMessage({ type: 'success', text: 'Personal task created successfully!' });
      setTask({ title: '', description: '' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      
    } catch (err) {
      console.error("Error creating personal task:", err);
      const errorMessage = err.response?.data?.message || 'Failed to create task. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-personal-task">
      <div className="create-task-header">
        <h1>Create Personal Task</h1>
        <p>Add tasks to help organize your personal work and goals.</p>
      </div>

      <div className="create-task-form-container">
        <form onSubmit={handleSubmit} className="personal-task-form">
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="e.g., Review project documentation"
              value={task.title}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              rows="4"
              placeholder="Describe what needs to be done..."
              value={task.description}
              onChange={handleChange}
              required
              disabled={loading}
            ></textarea>
          </div>

          <div className="task-info">
            <div className="info-item">
              <span className="info-label">Assigned to:</span>
              <span className="info-value">{user?.name || 'You'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Due date:</span>
              <span className="info-value">7 days from creation</span>
            </div>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              <span className="message-icon">
                {message.type === 'success' ? '✅' : '❌'}
              </span>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading || !task.title.trim() || !task.description.trim()}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Creating Task...
              </>
            ) : (
              <>
                <span className="btn-icon">📝</span>
                Create Personal Task
              </>
            )}
          </button>
        </form>

        <div className="task-tips">
          <h3>💡 Tips for Personal Tasks</h3>
          <ul>
            <li>Keep titles clear and specific</li>
            <li>Break large tasks into smaller ones</li>
            <li>Include actionable details in descriptions</li>
            <li>Personal tasks help track your individual goals</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CreatePersonalTask;