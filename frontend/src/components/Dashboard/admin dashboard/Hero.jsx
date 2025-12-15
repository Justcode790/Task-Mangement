import React, { useEffect, useState } from "react";
import "./hero.css";
import { Folder, Users, CheckCircle } from "lucide-react";
import api from "../../../api";

const Hero = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalUsers: 0,
    pendingTasks: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard-stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  const data = [
    {
      id: 1,
      label: "Total Projects",
      value: stats.totalProjects,
      icon: <Folder color="#007bff" size={28} />,
    },
    {
      id: 2,
      label: "Total Users",
      value: stats.totalUsers,
      icon: <Users color="#007bff" size={28} />,
    },
    {
      id: 3,
      label: "Pending Tasks",
      value: stats.pendingTasks,
      icon: <CheckCircle color="green" size={28} />,
    },
  ];

  return (
    <div className="snapshot-container">
      <h2 className="snapshot-title">Team Snapshot</h2>
      <div className="snapshot-cards">
        {data.map((item) => (
          <div key={item.id} className="snapshot-card">
            <div className="icon">{item.icon}</div>
            <h3 className="label">{item.label}</h3>
            <p className="value">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
