import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8080/api/tasks/user/${user.id}`)
        .then(res => res.json())
        .then(data => setTasks(data));

      fetch(`http://localhost:8080/api/habits/user/${user.id}`)
        .then(res => res.json())
        .then(data => setHabits(data));
    }
  }, [user]);

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

        <section>
          <h2>📋 Your Tasks</h2>
          <ul>
            {tasks.map(task => (
              <li key={task.id}>{task.title} - {task.status}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>💪 Your Habits</h2>
          <ul>
            {habits.map(habit => (
              <li key={habit.id}>{habit.title} - {habit.frequency}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
