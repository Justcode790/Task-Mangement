import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import './NewTask.css';
import { Calendar, CheckCircle, AlertCircle, User } from 'lucide-react';

function Newtask() {
  const [task, setTask] = useState({
    title: '',
    description: '',
    assignedTo: '', // store selected employee
    dueDate: '' // add dueDate field
  });
  const [userOptions, setUserOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "title") {
      value = value.toUpperCase();
    }

    setTask({ ...task, [name]: value });
  };

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await api.get('/selectEmployee');

        console.log("Employees fetched:", res);
        setUserOptions(res.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        if (error.response?.status === 401) {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting task:", task);
    try {
      const response = await api.post('/task', task);
      alert('Successfully created a task');
      setTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      navigate("/admin/alltask");
    } catch (err) {
      console.error("Error creating task:", err);
      console.error("Error response:", err.response?.data);
      alert(`Error creating task: ${err.response?.data?.message || err.message}`);
      if (err.response?.status === 401) {
        navigate("/");
      }
    }
  };

  return (
    <div className="create-task-container">
      <div className="create-task-header">
        <h1 className="create-task-title">Create a New Task</h1>
        <p className="create-task-subtitle">
          Fill in the details below to assign a new task.
        </p>
      </div>

      <div className="create-task-form-wrapper">
        <form onSubmit={handleSubmit} className="create-task-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="e.g., DEVELOP LANDING PAGE"
              value={task.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              rows="4"
              placeholder="Enter a detailed description..."
              value={task.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="assignedTo" >Assign To</label>
              <div className="input-icon">
                <span className="icon"><User size={18} /></span>
                <select
                  name="assignedTo"
                  id="assignedTo"
                  value={task.assignedTo}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="" >
                    {loading ? "Loading employees..." : "Select Employee"}
                  </option>
                  {userOptions.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <div className="input-icon">
                <span className="icon"><Calendar size={18} /></span>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={task.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}

export default Newtask;
