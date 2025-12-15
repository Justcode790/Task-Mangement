import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import api from "../../api";
import "../Dashboard/employeeD.css";

function ActiveTask() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const { user } = useUser(); // destructure user

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          return <p>Loading user...</p>;
        }

        const res = await api.get("/task/active", { withCredentials: true });
        if (!res.data) return setTasks([]);

        // Filter tasks assigned to this user
        console.log(user);
        
        const data = res.data.filter(
          (task) =>
            task.assignedTo &&
            String(task.assignedTo._id) === String(user._id)
        );

        setTasks(data);
      } catch (err) {
        if (err.response?.status === 401) navigate("/");
        console.error(err);
      }
    };

    fetchData();
  }, [user, navigate]);

  return (
    <div>
      <h3>Active Tasks</h3>
      <div className="tasks">
        {tasks.length === 0 ? (
          <p>No active tasks assigned to you</p>
        ) : (
          tasks.map((task) => 
          <div key={task._id}  style={{ background: "#e2ab08d6" }} className="task-card task-active">
            
            <div className="task-title" style={{color:"white"}}>{task.title}</div>
            <div className="task-detail">
              <div className="owner">{task.createdBy.name}</div>
              <div className="due-date">5 days</div>
              </div>

          
          </div>)
        )}
      </div>
    </div>
  );
}

export default ActiveTask;
