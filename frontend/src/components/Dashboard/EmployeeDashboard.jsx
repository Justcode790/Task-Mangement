import React, { useState } from "react";
import NavbarEmployee from "../../navbar/NavbarEmployee";
import ActiveTask from "../tasks/ActiveTask";
import CompletedTask from "../tasks/CompletedTask";
import RejectedTask from "../tasks/Rejectedtask";
import "./employeeD.css";
import Notification from "../tasks/Notification";

function EmployeeDashboard() {
  const [view, setView] = useState("active"); // active / completed / rejected
  const [showNotification, setShowNotification] = useState(false);

  return (
    <div className="employee-dashboard">
      
      <NavbarEmployee onClickNotification={() => setShowNotification(true)} onClickCompleted = {()=>setView("completed")} onClickRejected = {()=>setView("rejected")} onClickActive = {()=>setView("active")}/>

     

      {/* Main content */}
      <div className="main">
        
          {view === "active" && <ActiveTask />}
          {view === "completed" && <CompletedTask />}
          {view === "rejected" && <RejectedTask />}
      </div>

      {/* Notification popup */}
      {showNotification && (
        <Notification setShownotification={setShowNotification}/>
      )}
    </div>
  );
}

export default EmployeeDashboard;
