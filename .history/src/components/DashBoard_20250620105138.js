import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/"); // Redirect if no user
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

    return (
        <div className="dashboard-container">
        <header className="dashboard-header">
            <button onClick={handleLogout}>Logout</button>
        </header>

        <main>
            <h1>Hello {user?.username}, let's achieve some goals! 🎯</h1>
        </main>
        </div>
    );
}
