import React from 'react'
import { Outlet } from 'react-router-dom';
import Newtask from '../tasks/Newtask';
// import AdminDashboard from '../Dashboard/AdminDashboard';
import AdminDashboard1 from '../Dashboard/AdminDashboard1';

function AdminRoutes() {
  return (
    <div>
        {/* <AdminDashboard/> */}
        <AdminDashboard1/>
        {/* <Outlet /> */}
        
       
    </div>
  )
}

export default AdminRoutes;