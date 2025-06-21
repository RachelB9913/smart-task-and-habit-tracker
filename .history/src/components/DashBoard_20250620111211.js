import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";

export default function Dashboard() {
  const [username, setUsername] = useState(""); 
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

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <button onClick={handleLogout}>Logout</button>
      </header>

      <main>
        <h1>Hello <strong>{username}</strong>, let's achieve some goals! 🎯</h1>
        <p>📋 <a href="#">My Tasks</a></p>
        <p>💪 <a href="#">My Habits</a></p>
      </main>
    </div>
  );
}
