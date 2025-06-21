// Dashboard.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [showTasks, setShowTasks] = useState(false);
  const [showHabits, setShowHabits] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [background, setBackground] = useState("light");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");
    if (storedUsername) setUsername(storedUsername);
    if (storedUserId) setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:8080/api/tasks/user/${userId}`)
        .then(res => res.json())
        .then(data => setTasks(data))
        .catch(err => console.error("Error fetching tasks:", err));

      fetch(`http://localhost:8080/api/habits/user/${userId}`)
        .then(res => res.json())
        .then(data => setHabits(data))
        .catch(err => console.error("Error fetching habits:", err));
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const toggleBackground = () => {
    setBackground((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className={`dashboard-container ${background}`}>
      <header className="dashboard-header">
        <div className="header-left">
          <h2>Hello {username}</h2>
        </div>
        <div className="header-right">
          <button onClick={toggleBackground} className="bg-toggle">Toggle BG</button>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>

      <main>
        <h1>Let's achieve some goals! 🎯</h1>

        <button onClick={() => setShowTasks(!showTasks)} className="toggle-button">
          📋 My Tasks
        </button>
        {showTasks && (
          <div className="task-section">
            <ul>
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <li key={index}>{task.title}</li>
                ))
              ) : (
                <li>No tasks yet</li>
              )}
            </ul>
          </div>
        )}

        <button onClick={() => setShowHabits(!showHabits)} className="toggle-button">
          💪 My Habits
        </button>
        {showHabits && (
          <div className="habit-section">
            <ul>
              {habits.length > 0 ? (
                habits.map((habit, index) => (
                  <li key={index}>{habit.title}</li>
                ))
              ) : (
                <li>No habits yet</li>
              )}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
