import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../navbar/navbar';
import './adminD.css';
import api from '../../api';
import NavbarAdmin from '../../navbar/NavbarAdmin';
import { useUser } from "../../context/UserContext";
import Hero from './admin dashboard/Hero';

function AdminDashboard1() {
  const {user} = useUser();
  // console.log("it is coming from admindashboard: ",user);
  const [task, setTask] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  

  useEffect(() => {
    if (location.pathname === '/admin') {
      const fetchData = async () => {
        try {
          const res = await api.get("/task");
          console.log(res);
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
      {/* <Navbar /> */}
      <NavbarAdmin/>
      <div className='adminDashboardView'>
        <div className="adminDashboardView-heading">
          {user? <h1>Project Overview,{String(user.name)}!</h1> : "guest"}
          {new Date().toDateString()}
        </div>
        {isMainDashboard && (
          <Hero/>
        )}

        {/* Outlet always exists to show nested pages like create-task */}
        <Outlet />
      </div>
    </>
  );
}

export default AdminDashboard1;
