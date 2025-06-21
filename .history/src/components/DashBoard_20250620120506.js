// Dashboard.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [showTasks, setShowTasks] = useState(false);
  const [showHabits, setShowHabits] = useState(false);
  const [background, setBackground] = useState("light");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  // const toggleBackground = () => {
  //   setBackground((prev) => (prev === "light" ? "dark" : "light"));
  // };

  return (
    <div className={`dashboard-container ${background}`}>
      <header className="dashboard-header">
        <div className="header-left centered-text">
          <h2>Hello {username}</h2>
        </div>
        <div className="header-right">
          {/* <button onClick={toggleBackground} className="bg-toggle">Toggle BG</button> */}
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>

      <main>
        <h1>Let's Achieve Some Goals! 🎯</h1>

        <button onClick={() => setShowTasks(!showTasks)} className="toggle-button">
          📋 My Tasks
        </button>
        {showTasks && (
          <div className="task-section">
            <ul>
              <li>Sample Task 1</li>
              <li>Sample Task 2</li>
            </ul>
          </div>
        )}

        <button onClick={() => setShowHabits(!showHabits)} className="toggle-button">
          💪 My Habits
        </button>
        {showHabits && (
          <div className="habit-section">
            <ul>
              <li>Sample Habit A</li>
              <li>Sample Habit B</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}