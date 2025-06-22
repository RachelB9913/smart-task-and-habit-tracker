import React from "react";
import "./SchedulePlanner.css";

const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6 to 23
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function SchedulePlanner({ tasks = [] }) {
  return (

    <div className="dashboard-container light">
        <header className="dashboard-header">
            <div className="header-left">
            <h2>🗓️ Weekly Planner</h2>
            </div>
            <div className="header-right">
            <button onClick={() => navigate("/")} className="logout-button">Back to Dashboard</button>
            </div>
        </header>
        <div className="planner-container">
        <aside className="task-sidebar">
            <h3>Tasks</h3>
            <ul>
            {tasks.map((task, index) => (
                <li key={index} className="task-item">
                {task.title}
                </li>
            ))}
            </ul>
        </aside>

        <main className="calendar-grid">
            <div className="grid-header">
            <div className="cell hour-cell"></div>
            {days.map((day) => (
                <div key={day} className="cell day-cell">{day}</div>
            ))}
            </div>

            <div className="grid-body">
            {hours.map((hour) => (
                <div className="row" key={hour}>
                <div className="cell hour-cell">{hour}:00</div>
                {days.map((day) => (
                    <div key={`${day}-${hour}`} className="cell time-slot"></div>
                ))}
                </div>
            ))}
            </div>
        </main>
        </div>
    </div>
  );
}