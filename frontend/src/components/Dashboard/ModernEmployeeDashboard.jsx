import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardView from './DashboardView';
import CreatePersonalTask from './CreatePersonalTask';
import './ModernEmployeeDashboard.css';

function ModernEmployeeDashboard() {
  const [activeView, setActiveView] = useState('dashboard');

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'create-task':
        return <CreatePersonalTask />;
      case 'dashboard':
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="modern-employee-dashboard">
      <Sidebar 
        activeView={activeView} 
        onViewChange={handleViewChange} 
      />
      <main className="main-content">
        {renderMainContent()}
      </main>
    </div>
  );
}

export default ModernEmployeeDashboard;