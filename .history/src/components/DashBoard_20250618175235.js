import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Retrieve username from localStorage (or context/auth state later)
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Hello {username}, let's achieve some goals! 🎯</h1>
      <button onClick={() => navigate("/")}>← Back to Welcome</button>
    </div>
  );
}
