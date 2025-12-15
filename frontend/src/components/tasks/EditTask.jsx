import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import './NewTask.css';

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    state: ""
  });

  const [loading, setLoading] = useState(true);

  // 🔹 Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/admin/task/${id}`);
        console.log(res.data);
        if (res.data.status !== "active") {
          alert("You cannot edit a non-active task");
          navigate("/admin");
          return;
        }

        setFormData({
          title: res.data.title,
          description: res.data.description,
          assignedTo: res.data.assignedTo?._id || "",
          dueDate: res.data.date?.split("T")[0],
          state: res.data.state
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate("/admin");
      }
    };

    fetchTask();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/task/${id}`, formData);
      alert("Task updated successfully");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="newtask-container">
      <h2>Edit Task</h2>

      <form className="newtask-form" onSubmit={handleSubmit}>
        <label>Task Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <label>Assign To (Employee ID)</label>
        <input
          type="text"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
        />

        <label>Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />

        <button type="submit" className="submit-btn">
          Update Task
        </button>
      </form>
    </div>
  );
}

export default EditTask;
