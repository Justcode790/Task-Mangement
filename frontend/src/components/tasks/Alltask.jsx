import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import "./alltask.css";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import getStatusClass from "./others";

function Alltask() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/task");
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  const filteredTasks = tasks.filter(
    (task) =>
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

 async function deleteTask(id) {
  try {
    const res = await api.delete(`/admin/task/delete/${id}`);

    if (res.status === 200) {
      alert(res.data.message);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== id)
      );
    } else {
      alert("there is an error in deletion");
    }
  } catch (err) {
    console.error(err);
    alert("there is an error in deletion");
  }
}


  getStatusClass("ongoing");

  return (
    <div className="alltask-container">
      <div className="header">
        <div>
          <h1 className="title">Projects</h1>
          <p className="subtitle">
            Manage and track all your team's projects.
          </p>
        </div>
        <button
          className="add-btn"
          onClick={() => {
            navigate("/admin/newtask");
          }}
        >
          <Plus size={18} className="mr-2" />
          Add New Project
        </button>
      </div>

      <div className="search-bar">
        <div className="relative">
          <span className="search-icon">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by project or employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading && (
        <div className="no-results">Loading projects...</div>
      )}

      {!loading && (
        <div className="table-container">
          <table className="task-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Employee</th>
                <th>Status</th>
                <th>Due Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((project) => (
                <tr key={project._id}>
                  <td>{project.title}</td>
                  <td>{project.assignedTo?.name || "Unassigned"}</td>
                  <td>
                    <span>{project.status}</span>
                  </td>
                  <td>{new Date(project.date).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <Edit
                        size={18}
                        className={
                          project.state === "active"
                            ? "icon"
                            : "icon disabled"
                        }
                        onClick={() => {
                          navigate(`/admin/task/edit/${project._id}`);
                        }}
                      />

                      <Trash2
                        size={18}
                        className={
                          project.state === "active"
                            ? "icon"
                            : "icon disabled"
                        }
                        onClick={() => {
                          deleteTask(project._id);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTasks.length === 0 && tasks.length > 0 && (
            <div className="no-results">
              No projects match your search.
            </div>
          )}

          {tasks.length === 0 && (
            <div className="no-results">No projects found.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Alltask;
