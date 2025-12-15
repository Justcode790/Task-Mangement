import React from 'react'
import { Outlet } from 'react-router-dom';
import EmployeeDashboard from "../Dashboard/EmployeeDashboard"

function EmployeeRoutes() {
  return (
    <div>
        <EmployeeDashboard/>
        {/* <Outlet /> */}
        
       
    </div>
  )
}

export default EmployeeRoutes;