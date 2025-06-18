import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve username from localStorage (or context/auth state later)
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
            <h1>Hello {username}, let's achieve some goals! 🎯</h1>
        </main>
        </div>
    );
}
