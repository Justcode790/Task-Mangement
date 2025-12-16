import React from 'react'
import { Outlet } from 'react-router-dom';
import ModernEmployeeDashboard from "../Dashboard/ModernEmployeeDashboard"

function EmployeeRoutes() {
  return (
    <div>
        <ModernEmployeeDashboard/>
        {/* <Outlet /> */}
        
       
    </div>
  )
}

export default EmployeeRoutes;