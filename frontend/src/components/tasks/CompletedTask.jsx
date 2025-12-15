import React, { useEffect, useState } from "react";
import api from "../../api";
import '../Dashboard/employeeD.css'

function CompletedTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/task/completed", { withCredentials: true });
        if(!res.data){
            return setTasks([]);
        }
        const data = res.data.filter(task=>user.id===task.assignedTo);
        setTasks(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <h3>Completed Tasks</h3>
      {tasks.length === 0 ? (
        <p>No completed tasks assigned to you</p>
      ) : (
        tasks.map((task) => <div key={task._id} className="task">{task.title}</div>)
      )}
    </div>
  );
}

export default CompletedTasks;
