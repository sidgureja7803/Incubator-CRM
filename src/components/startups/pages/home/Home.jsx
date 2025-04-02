import React, { useState, useEffect } from "react";
import "./Home.css";

const Home = () => {
  const [startupData, setStartupData] = useState({
    name: "ThinkWaveeee",
    stats: {
      revenue: "₹10,000",
      customers: 100,
      employees: 4,
      valuation: "₹12,000"
    },
    upcomingMeetings: [
      { id: 1, title: "Meeting with Investors", date: "2023-11-30", time: "10:00 AM" },
      { id: 2, title: "Product Demo", date: "2023-12-02", time: "2:00 PM" }
    ],
    tasks: [
      { id: 1, title: "Complete Financial Reports", deadline: "2023-11-28", status: "pending" },
      { id: 2, title: "Prepare Pitch Deck", deadline: "2023-11-25", status: "completed" },
      { id: 3, title: "Meet with Mentors", deadline: "2023-12-05", status: "pending" }
    ]
  });

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="welcome-section">
        <h2>Welcome back to {startupData.name}</h2>
        <p>Here's what's happening today</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Revenue</h3>
          <p>{startupData.stats.revenue}</p>
        </div>
        <div className="stat-card">
          <h3>Customers</h3>
          <p>{startupData.stats.customers}</p>
        </div>
        <div className="stat-card">
          <h3>Team Size</h3>
          <p>{startupData.stats.employees}</p>
        </div>
        <div className="stat-card">
          <h3>Valuation</h3>
          <p>{startupData.stats.valuation}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Upcoming Meetings</h3>
          <div className="meetings-list">
            {startupData.upcomingMeetings.map(meeting => (
              <div key={meeting.id} className="meeting-item">
                <h4>{meeting.title}</h4>
                <p>{meeting.date} at {meeting.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Tasks</h3>
          <div className="tasks-list">
            {startupData.tasks.map(task => (
              <div key={task.id} className={`task-item ${task.status}`}>
                <h4>{task.title}</h4>
                <p>Deadline: {task.deadline}</p>
                <span className="task-status">{task.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 