// Dashboard.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../Dashboard.css";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [startHour, setStartHour] = useState(6);
  const [endHour, setEndHour] = useState(23);

  const [showTasks, setShowTasks] = useState(false);
  const [showHabits, setShowHabits] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingHabitId, setEditingHabitId] = useState(null);

  const [background, setBackground] = useState("light");

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", scheduledTime: "", status: ""});

  const [showHabitForm, setShowHabitForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ title: "", description: "", frequency: "" , preferredTime: ""});

  const navigate = useNavigate();

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = reorder(tasks, result.source.index, result.destination.index);
    setTasks(reordered);
  };

  const handleAddTask = async () => {
    try {
      const url = editingTaskId
        ? `http://localhost:8080/api/tasks/${editingTaskId}`
        : `http://localhost:8080/api/tasks/user/${userId}`;

      const method = editingTaskId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTask, userId })
      });

      if (!response.ok) throw new Error("Failed to save task");

      const saved = await response.json();

      if (editingTaskId) {
        setTasks(prev => prev.map(t => t.id === saved.id ? saved : t));
      } else {
        setTasks([...tasks, saved]);
      }

      // Track if it's scheduled
      if (saved.scheduledTime) {
        const scheduled = JSON.parse(localStorage.getItem("scheduledItems") || "[]");
        const exists = scheduled.some(item => item.id === String(saved.id));
        if (!exists) {
          scheduled.push({ id: String(saved.id), type: "task", scheduledAt: new Date().toISOString() });
          localStorage.setItem("scheduledItems", JSON.stringify(scheduled));
          window.dispatchEvent(new Event("storage-updated"));
        }
      }

      // Track if it's completed
      if (saved.status === "Done") {
        const completions = JSON.parse(localStorage.getItem("taskCompletions") || "[]");
        const already = completions.some(entry => entry.taskId === saved.id);
        if (!already) {
          completions.push({ taskId: saved.id, completedAt: new Date().toISOString() });
          localStorage.setItem("taskCompletions", JSON.stringify(completions));
          window.dispatchEvent(new Event("storage-updated"));
        }
      }

      // Reset form
      setNewTask({ title: "", description: "", scheduledTime: "", status: "" });
      setEditingTaskId(null);
      setShowTaskForm(false);
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const incompleteTasks = tasks.filter(task => task.status !== "Done");
  const completedTasks = tasks.filter(task => task.status === "Done");
  const sortedTasks = [...incompleteTasks, ...completedTasks];

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
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/users/${userId}`);
        const data = await res.json();
        setStartHour(data.startHour ?? 6);
        setEndHour(data.endHour ?? 23);
        setUsername(data.username);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

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
        
        const scheduled = JSON.parse(localStorage.getItem("scheduledItems") || "[]");
        const now = new Date().toISOString();
        let changed = false;

        taskDetails.forEach(task => {
          if (task.scheduledTime) {
            const exists = scheduled.some(item => item.id === String(task.id));
            if (!exists) {
              scheduled.push({ id: String(task.id), type: "task", scheduledAt: now });
              changed = true;
            }
          }
        });

        if (changed) {
          localStorage.setItem("scheduledItems", JSON.stringify(scheduled));
          window.dispatchEvent(new Event("storage-updated"));
        }

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }

      const updated = await response.json();

      // Update frontend state
      setTasks(prev => prev.map(task => task.id === updated.id ? updated : task));

      // Schedule count tracking
      if (updated.scheduledTime) {
        const scheduled = JSON.parse(localStorage.getItem("scheduledItems") || "[]");
        const exists = scheduled.some(item => item.id === String(updated.id));
        if (!exists) {
          scheduled.push({ id: String(updated.id), type: "task", scheduledAt: new Date().toISOString() });
          localStorage.setItem("scheduledItems", JSON.stringify(scheduled));
          window.dispatchEvent(new Event("storage-updated"));
        }
      }

      // Completion tracking
      const completions = JSON.parse(localStorage.getItem("taskCompletions") || "[]");
      const already = completions.some(entry => entry.taskId === updated.id);

      if (newStatus === "Done" && updated.scheduledTime && !already) {
        completions.push({ taskId: updated.id, completedAt: new Date().toISOString() });
        localStorage.setItem("taskCompletions", JSON.stringify(completions));
        window.dispatchEvent(new Event("storage-updated"));
      }

      if (newStatus !== "Done" && already) {
        const cleaned = completions.filter(entry => entry.taskId !== updated.id);
        localStorage.setItem("taskCompletions", JSON.stringify(cleaned));
        window.dispatchEvent(new Event("storage-updated"));
      }

    } catch (error) {
      console.error("Error toggling task status:", error);
      alert("Failed to update task status. Please try again.");
    }
  };


  const handleAddHabit = async () => {
    try {
      const url = editingHabitId
        ? `http://localhost:8080/api/habits/${editingHabitId}`
        : `http://localhost:8080/api/habits/user/${userId}`;

      const method = editingHabitId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newHabit, userId })
      });

      if (!response.ok) throw new Error("Failed to save habit");

      const saved = await response.json();

      if (editingHabitId) {
        setHabits(prev => prev.map(h => h.id === saved.id ? saved : h));
      } else {
        setHabits([...habits, saved]);
      }

      setNewHabit({ title: "", description: "", frequency: "" , preferredTime: ""});
      setEditingHabitId(null);
      setShowHabitForm(false);
    } catch (err) {
      console.error("Error saving habit:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEditTask = (task) => {
    setNewTask(task);
    setEditingTaskId(task.id);
    setShowTaskForm(true);
  };

  const handleEditHabit = (habit) => {
    setNewHabit(habit);
    setEditingHabitId(habit.id);
    setShowHabitForm(true);
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/habits/${habitId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete habit");

      setHabits(habits.filter(h => h.id !== habitId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className={`dashboard-container ${background}`}>
      <header className="dashboard-header">
        <div className="header-left">
          <h2>Welcome, {username} 👋</h2>
          <p>Your planner runs from {startHour}:00 to {endHour}:00</p>
          <SchedulePlanner startHour={startHour} endHour={endHour} />
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
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="task-list">
                {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef}>
                    {sortedTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                        {(provided) => (
                          <li
                            className="task-item"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="task-content">
                              <input
                                type="checkbox"
                                checked={task.status === "Done"}
                                onChange={() => toggleTaskStatus(task.id, task.status)}
                              />
                              <div className={`task-details ${task.status === "Done" ? "task-done" : ""}`}>
                                <strong>{task.title}</strong><br />
                                {task.description} – {task.scheduledTime} – <em>{task.status}</em>
                              </div>
                              <div className="task-actions">
                                <button className="edit-button" onClick={() => handleEditTask(task)}>🖊️</button>
                                <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>🗑️</button>
                              </div>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}

        {showTaskForm && (
          <div className="form-popup-overlay">
            <div className="form-popup">
              <input
                type="text"
                placeholder="Title"
                value={newTask.title ?? ""}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                value={newTask.description ?? ""}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Time to do"
                value={newTask.scheduledTime ?? ""}
                onChange={e => setNewTask({ ...newTask, scheduledTime: e.target.value })}
              />
              <input
                type="text"
                placeholder="Status"
                value={newTask.status ?? ""}
                onChange={e => setNewTask({ ...newTask, status: e.target.value })}
              />
              <button onClick={handleAddTask} className="bg-toggle">{editingTaskId ? "Update Task" : "Add Task"}</button>
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
                <li key={index} className="task-item">
                  <div className="task-content">
                    <div className="task-details">
                      <strong>{habit.title}</strong><br />
                      {habit.description} – <em>{habit.frequency}</em> – {habit.preferredTime}
                    </div>
                    <div className="task-actions">
                      <button className="edit-button" onClick={() => handleEditHabit(habit)}>🖊️</button>
                      <button className="delete-button" onClick={() => handleDeleteHabit(habit.id)}>🗑️</button>
                    </div>
                  </div>
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
              <input type="text" placeholder="Preferred Time (e.g. morning, 08:00)" value={newHabit.preferredTime} onChange={e => setNewHabit({...newHabit, preferredTime: e.target.value})} />
              <button onClick={handleAddHabit} className="bg-toggle"> {editingHabitId ? "Update Habit" : "Add Habit"}</button>
              <button onClick={() => setShowHabitForm(false)} className="logout-button">Close</button>
            </div>
          </div>
        )}
        <button
          onClick={() => navigate("/schedule", { state: { tasks, habits } })}
          className="toggle-button"
        >
          📅 Let's Schedule
        </button>
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
