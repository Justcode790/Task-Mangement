import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../navbar/navbar';
import './adminD.css';
import api from '../../api';
import NavbarAdmin from '../../navbar/NavbarAdmin';
import { useUser } from "../../context/UserContext";

function AdminDashboard() {
  const {user} = useUser();
  console.log(user);
  const [task, setTask] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  

  useEffect(() => {
    if (location.pathname === '/admin') {
      const fetchData = async () => {
        try {
          const res = await api.get("/task",{withCredentials: true });
          if(!res.data){
            return setTask([]);
          }
          // console.log(res.data);
          setTask(res.data);
        } catch (err) {
           if(err.response?.status===401){
            navigate("/");
          }
          console.error(err);
        }
      };
      fetchData();
    }
  }, [location.pathname]);

  const isMainDashboard = location.pathname === '/admin';

  return (
    <>
      <Navbar />
      {/* <NavbarAdmin/> */}
      <div className='adminDashboardView'>
        <div className="adminDashboardView-heading">
          {user? <h1>Project Overview,{String(user.name.toUpperCase())}!</h1> : "guest"}
          {new Date().toDateString()}
        </div>
        {isMainDashboard && (
          <div className='tasks'>
            {task.length === 0 ? (
              <p>No tasks available</p>
            ) : (
              task.filter((t) => t.status === 'new' || t.status === 'active')
                  .map((t, i) => (
                <Link to={`/admin/task/${t._id}`} key={t._id}>
                  <div className={`task-card status-${t.status}`}>
                    <div className="task-header">
                      <h3 className="task-title">{t.title}</h3>
                      <span className="status-badge">{t.status}</span>
                    </div>
                    <p className="task-desc">{t.description}</p>
                    <div className="task-footer">
                      <span className="assigned-label">👤 Assigned to:</span>
                      <span className="assigned-name">{t.assignedTo?.name || "Unassigned"}</span>
                    </div>
                    <div className="task-footer">
                      <span className="assigned-label">Createdby to:</span>
                      <span className="assigned-name">{t.createdBy?.name || "Unassigned"}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Outlet always exists to show nested pages like create-task */}
        <Outlet />
      </div>
    </>
  );
}

export default AdminDashboard;
