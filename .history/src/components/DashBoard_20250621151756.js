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

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "", status: "" , "dueDate": "" });

  const [showHabitForm, setShowHabitForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ title: "", description: "", frequency: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");

    if (storedUsername) setUsername(storedUsername);
    if (storedUserId) {
      const parsedId = Number(storedUserId);
      if (!isNaN(parsedId)) {
        setUserId(parsedId);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8080/api/users/${userId}`)
      .then(res => res.json())
      .then(async (userData) => {
        // Optionally reset state
        setTasks([]);
        setHabits([]);

        // Fetch full task objects
        const taskDetails = await Promise.all(
          (userData.taskIds || []).map(id =>
            fetch(`http://localhost:8080/api/tasks/${id}`).then(res => res.json())
          )
        );
        setTasks(taskDetails);

        // Fetch full habit objects
        const habitDetails = await Promise.all(
          (userData.habitIds || []).map(id =>
            fetch(`http://localhost:8080/api/habits/${id}`).then(res => res.json())
          )
        );
        setHabits(habitDetails);
      })
      .catch(err => console.error("Error fetching user/tasks/habits:", err));
  }, [userId]);


  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
  const newStatus = currentStatus === "Done" ? "In Progress" : "Done";

  try {
    const response = await fetch(`http://localhost:8080/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) {
      throw new Error("Failed to update task status");
    }

    // Optional: Refresh task list
    const updated = await response.json();
    setTasks(prev =>
      prev.map(task => task.id === updated.id ? updated : task)
    );

  } catch (error) {
    console.error("Error toggling task status:", error);
    alert("Failed to update task status. Please try again.");
  }
};

  const handleAddTask = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/user/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...newTask, userId })
      });
      if (!response.ok) {
        throw new Error("Unauthorized or failed to add task");
      }
      const saved = await response.json();
      setTasks([...tasks, saved]);
      setNewTask({ title: "", description: "", priority: "", status: "" , dueDate: "" });
      setShowTaskForm(false);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleAddHabit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/habits/user/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...newHabit, userId: Number(userId) }),
      });
      if (!response.ok) {
        throw new Error("Unauthorized or failed to add habit");
      }
      const saved = await response.json();
      setHabits([...habits, saved]);
      setNewHabit({ title: "", description: "", frequency: "" });
      setShowHabitForm(false);
    } catch (err) {
      console.error("Error adding habit:", err);
    }
  };

  return (
    <div className={`dashboard-container ${background}`}>
      <header className="dashboard-header">
        <div className="header-left">
          <h2>Hello {username}</h2>
        </div>
        <div className="header-right">
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
            <button onClick={() => setShowTaskForm(!showTaskForm)} className="add-button">+</button>
            <ul>
              {tasks.length > 0 ? tasks.map((task, index) => 
                <li key={index}>
                  <input type="checkbox" checked={task.status === "Done"}
                    onChange={() => toggleTaskStatus(task.id, task.status)}
                  />
                  <span>{task.title}</span>
                  <strong>{task.title}</strong><br />
                  {task.description} – <em>{task.status}</em> - <strong>DueDate: {task.dueDate}</strong>
                </li>
                ) : <li>No tasks yet</li>}
            </ul>
          </div>
        )}

        {showTaskForm && (
          <div className="form-popup-overlay">
            <div className="form-popup">
              <input type="text" placeholder="Title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
              <input type="text" placeholder="Description" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
              <input type="text" placeholder="Priority" value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })} />
              <input type="text" placeholder="Status" value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value })} />
              <input type="date" placeholder="Due Date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
              <button onClick={handleAddTask} className="bg-toggle">Add</button>
              <button onClick={() => setShowTaskForm(false)} className="logout-button">Close</button>
            </div>
          </div>
        )}

        <button onClick={() => setShowHabits(!showHabits)} className="toggle-button">
          💪 My Habits
        </button>
        {showHabits && (
          <div className="task-section">
            <button onClick={() => setShowHabitForm(!showHabitForm)} className="add-button">+</button>
            <ul>
              {habits.length > 0 ? habits.map((habit, index) =>
                 <li key={index}>
                    <strong>{habit.title}</strong><br />
                    {habit.description} – <em>{habit.frequency}</em>
                  </li>
                ) : <li>No habits yet</li>}
            </ul>
          </div>
        )}

        {showHabitForm && (
          <div className="form-popup-overlay">
            <div className="form-popup">
              <input type="text" placeholder="Title" value={newHabit.title} onChange={e => setNewHabit({ ...newHabit, title: e.target.value })} />
              <input type="text" placeholder="Description" value={newHabit.description} onChange={e => setNewHabit({ ...newHabit, description: e.target.value })} />
              <input type="text" placeholder="Frequency" value={newHabit.frequency} onChange={e => setNewHabit({ ...newHabit, frequency: e.target.value })} />
              <button onClick={handleAddHabit} className="bg-toggle">Add</button>
              <button onClick={() => setShowHabitForm(false)} className="logout-button">Close</button>
            </div>
          </div>
        )}
        <br />
        <div>
          <h3>Debug:</h3>
          <p>User ID: {userId}</p>
          <p>Tasks Count: {tasks.length}</p>
          <p>Habits Count: {habits.length}</p>
        </div>
      </main>
    </div>
  );
}
