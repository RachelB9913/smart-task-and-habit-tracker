// SchedulePlanner.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import "./SchedulePlanner.css";
import "../Dashboard.css";

const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6 to 23
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const timeBlocks = {
  morning: [6, 7, 8, 9, 10],
  noon: [11, 12, 13, 14],
  evening: [17, 18, 19, 20, 21],
};

function getPreferredHours(preferredTime) {
  if (!preferredTime) return [];
  if (preferredTime.includes(":")) {
    const hour = parseInt(preferredTime.split(":")[0], 10);
    return [hour];
  }
  const block = timeBlocks[preferredTime.toLowerCase()];
  return block || [];
}

const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function getDaysFromFrequency(freq) {
  if (!freq) return [];
  if (freq === "Daily") return allDays;
  if (freq.includes(",")) {
    return freq.split(",").map(day => {
      switch (day.trim().toLowerCase()) {
        case "mon": return "Monday";
        case "tue": return "Tuesday";
        case "wed": return "Wednesday";
        case "thu": return "Thursday";
        case "fri": return "Friday";
        case "sat": return "Saturday";
        case "sun": return "Sunday";
        default: return null;
      }
    }).filter(Boolean);
  }
  const match = freq.match(/Every (\d+) days/);
  if (match) {
    const step = parseInt(match[1], 10);
    return allDays.filter((_, idx) => idx % step === 0);
  }
  return [];
}

function autoPlaceHabits(habits, currentSchedule, tasks, setHabitClones) {
  const newSchedule = { ...currentSchedule };
  const newClones = [];

  habits.forEach(habit => {
    if (!habit.frequency || !habit.preferredTime) return;

    const candidateDays = getDaysFromFrequency(habit.frequency);
    const candidateHours = getPreferredHours(habit.preferredTime);

    candidateDays.forEach(day => {
      let placed = false;
      for (const hour of candidateHours) {
        if (placed) break;
        const slotKey = `${day}-${hour}:00`;

        const alreadyHasClone = (newSchedule[slotKey] || []).some(id =>
          id.startsWith(`habit-${habit.id}-clone`)
        );

        if (!alreadyHasClone) {
          const cloneId = `habit-${habit.id}-clone-${Date.now()}-${Math.random().toString(36).slice(2)}`;
          if (!newSchedule[slotKey]) newSchedule[slotKey] = [];
          newSchedule[slotKey].push(cloneId);
          newClones.push({ id: cloneId, habitId: habit.id });
          placed = true;
        }
      }
    });
  });

  setHabitClones(prev => [...prev, ...newClones]);
  return newSchedule;
}

function syncScheduleFromTasks(tasks) {
  const newSchedule = {};
  tasks.forEach(task => {
    if (task.scheduledTime) {
      if (!newSchedule[task.scheduledTime]) newSchedule[task.scheduledTime] = [];
      newSchedule[task.scheduledTime].push(String(task.id));
    }
  });
  return newSchedule;
}

export default function SchedulePlanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState(location.state?.habits || []);
  const [scheduledTasks, setScheduledTasks] = useState({});
  const [habitClones, setHabitClones] = useState([]); // [{ id: 'habit-1-copy-1', habitId: 1 }]

  
  const saveSchedule = () => {
    const scheduleData = {
      scheduledTasks,
      habitClones,
    };
    localStorage.setItem("savedSchedule", JSON.stringify(scheduleData));
    alert("✅ Schedule saved locally!");
  };

  const handleAutoPlace = () => {
    const updatedSchedule = autoPlaceHabits(habits, scheduledTasks, tasks, setHabitClones);
    setScheduledTasks(updatedSchedule);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:8080/api/users/${userId}`)
      .then(res => res.json())
      .then(async (userData) => {
        const taskDetails = await Promise.all(
          (userData.taskIds || []).map(id =>
            fetch(`http://localhost:8080/api/tasks/${id}`).then(res => res.json())
          )
        );
        setTasks(taskDetails);
        setScheduledTasks(syncScheduleFromTasks(taskDetails));

        const habitDetails = await Promise.all(
          (userData.habitIds || []).map(id =>
            fetch(`http://localhost:8080/api/habits/${id}`).then(res => res.json())
          )
        );
        setHabits(habitDetails);

        // ✅ Now restore saved schedule (after both are loaded)
        const saved = localStorage.getItem("savedSchedule");
        if (location.state?.tasks) {
          setScheduledTasks(syncScheduleFromTasks(location.state.tasks));
        } else if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.scheduledTasks) setScheduledTasks(parsed.scheduledTasks);
          if (parsed.habitClones) setHabitClones(parsed.habitClones);
        } else {
          // fallback: construct schedule from tasks
          const initialSchedule = {};
          taskDetails.forEach(task => {
            if (task.scheduledTime) {
              if (!initialSchedule[task.scheduledTime]) initialSchedule[task.scheduledTime] = [];
              initialSchedule[task.scheduledTime].push(String(task.id));
            }
          });
          setScheduledTasks(initialSchedule);
        }
      })
      .catch(err => console.error("Failed to load tasks and habits:", err));
  }, []);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const itemsInDest = scheduledTasks[destination.droppableId] || [];
    const habitIdPrefix = draggableId.startsWith("habit-") ? draggableId.split("-copy")[0] : draggableId;
    
    if (itemsInDest.some(id => id === habitIdPrefix || id.startsWith(`${habitIdPrefix}-copy`))) {
      // Block duplicate placement
      return;
    }
    setScheduledTasks((prev) => {
      const updated = { ...prev };

      // Remove the dragged item from any previous slot
      Object.keys(updated).forEach((slot) => {
        const items = Array.isArray(updated[slot]) ? updated[slot] : [updated[slot]];
        if (items.includes(draggableId)) {
          updated[slot] = items.filter((id) => id !== draggableId);
        }
      });

      const slotItems = updated[destination.droppableId] || [];
      const currentValues = Array.isArray(slotItems) ? slotItems : [slotItems];
      updated[destination.droppableId] = [...currentValues, draggableId];

      if (!draggableId.startsWith("habit-")) {
        fetch(`http://localhost:8080/api/tasks/${draggableId}/schedule`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scheduledTime: destination.droppableId }),
        })
          .then((res) => res.json())
          .then((data) => console.log("✅ Scheduled:", data))
          .catch((err) => console.error("❌ Error scheduling task:", err));
      }

      return updated;
    });
  };

  const isScheduled = (id) => {
    return Object.values(scheduledTasks).flat().includes(String(id))
  };

  const cleanSchedule = async () => {
    if (!window.confirm("Are you sure you want to clear the entire schedule?")) return;

    try {
      // Clear task schedules on backend
      await Promise.all(
        tasks.map(task =>
          fetch(`http://localhost:8080/api/tasks/${task.id}/schedule`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ scheduledTime: null })
          })
        )
      );

      setScheduledTasks({});
      setHabitClones([]);
      setTasks(prev => prev.map(task => ({
        ...task,
        scheduledTime: null
      })));
      localStorage.removeItem("savedSchedule");

      alert("✅ Schedule has been cleared!");
    } catch (err) {
      console.error("❌ Failed to clear schedule:", err);
      alert("Error clearing schedule. Try again.");
    }
  };

  return (
    <div className="dashboard-container light">
      <header className="dashboard-header">
        <div className="header-left"><h2>🗓️ Weekly Planner</h2></div>
        <div className="header-right">
          <button onClick={() => navigate("/dashboard")} className="logout-button">
            Back to Dashboard
          </button>
        </div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="planner-container">
          <aside className="task-sidebar">
            <div className="save-button-container vertical-buttons">
              <button className="save-button" onClick={saveSchedule}>💾 Save Schedule</button>
              <button className="save-button" onClick={handleAutoPlace}>✨ Auto Place Habits</button>
              <button className="save-button" onClick={cleanSchedule}>🧹 Clean Schedule</button>
            </div>
            <h3>Tasks</h3>
            <Droppable droppableId="taskList">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {tasks.map((task, index) => {
                    const scheduled = isScheduled(task.id);

                    if (scheduled) {
                      return (
                        <li key={task.id} className="task-item grayed-out">
                          {task.title}
                        </li>
                      );
                    }

                    return (
                      <Draggable draggableId={String(task.id)} index={index} key={task.id}>
                        {(provided) => (
                          <li
                            className="task-item"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {task.title}
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
            <h3>Habits</h3>
            <Droppable droppableId="habitList">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {habits.map((habit, index) => (
                    <Draggable draggableId={`habit-${habit.id}`} index={index} key={habit.id}>
                      {(provided) => (
                        <li
                          className="task-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {habit.title}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {habitClones.map((clone, index) => {
                    const habit = habits.find(h => String(h.id) === String(clone.habitId));
                    if (!habit) return null;
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
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
                  {days.map((day) => {
                    const slotId = `${day}-${hour}:00`;
                    const scheduledItems = scheduledTasks[slotId] || [];
                    const items = Array.isArray(scheduledItems) ? scheduledItems : [scheduledItems];

                    return (
                      <Droppable droppableId={slotId} key={slotId}>
                        {(provided, snapshot) => (
                          <div
                            className={`cell time-slot ${snapshot.isDraggingOver ? "drag-over" : ""}`}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {items.map((id, i) => {
                              if (id.startsWith("habit-")) {
                                let habit;
                                if (id.includes("-clone-")) {
                                  const clone = habitClones.find(cl => cl.id === id);
                                  if (!clone) return null;
                                  habit = habits.find(h => String(h.id) === String(clone.habitId));
                                } else {
                                  const habitId = id.replace("habit-", "");
                                  habit = habits.find(h => String(h.id) === habitId);
                                }
                                return (
                                  <Draggable draggableId={id} index={i} key={`${id}-${i}`}>
                                    {(provided) => (
                                      <div
                                        className="scheduled-task habit-task"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <span>{habit.title}</span>
                                        <div className="habit-icons">
                                          <button
                                            className="duplicate-btn"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const newId = `habit-${habit.id}-copy-${Date.now()}`;
                                              setHabitClones((prev) => [...prev, { id: newId, habitId: habit.id }]);

                                              // Try to place near the current cell
                                              const [currentDay, currentHourStr] = slotId.split("-");
                                              const currentHour = parseInt(currentHourStr.split(":")[0], 10);
                                              const nearbySlots = [];

                                              // Search ±1 hour on same day
                                              for (let offset = -1; offset <= 1; offset++) {
                                                if (offset === 0) continue;
                                                const h = currentHour + offset;
                                                if (h >= 6 && h <= 23) {
                                                  nearbySlots.push(`${currentDay}-${h}:00`);
                                                }
                                              }

                                              // Search same hour on nearby days
                                              const dayIndex = days.indexOf(currentDay);
                                              if (dayIndex !== -1) {
                                                if (dayIndex > 0) nearbySlots.push(`${days[dayIndex - 1]}-${currentHour}:00`);
                                                if (dayIndex < 6) nearbySlots.push(`${days[dayIndex + 1]}-${currentHour}:00`);
                                              }

                                              // Find first available slot
                                              const targetSlot = nearbySlots.find(slot => {
                                                const items = scheduledTasks[slot] || [];
                                                return !items.some(item =>
                                                  item === `habit-${habit.id}` || item.startsWith(`habit-${habit.id}-copy`)
                                                );
                                              });

                                              const fallbackSlot = `${currentDay}-${Math.min(currentHour + 1, 23)}:00`; // safe upper bound

                                              const slotToUse = targetSlot || fallbackSlot;

                                              setScheduledTasks((prev) => {
                                                const updated = { ...prev };
                                                if (!updated[slotToUse]) updated[slotToUse] = [];
                                                updated[slotToUse].push(newId);
                                                return updated;
                                              });
                                            }}
                                          >➕</button>
                                          <button
                                            className="remove-btn"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setScheduledTasks((prev) => {
                                                const updated = { ...prev };
                                                updated[slotId] = updated[slotId].filter(val => val !== id);
                                                return updated;
                                              });
                                            }}
                                          >❌</button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              } else {
                                const task = tasks.find(t => String(t.id) === id);
                                if (!task) return null;
                                return (
                                  <Draggable draggableId={String(task.id)} index={i} key={`task-${task.id}-${i}`}>
                                    {(provided) => (
                                      <div
                                        className={`scheduled-task ${task.status === "Done" ? "done-task" : ""}`}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <span>{task.title}</span>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                          {task.status !== "Done" && (
                                            <>
                                              <button
                                                className="mark-done-btn"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  fetch(`http://localhost:8080/api/tasks/${task.id}/status`, {
                                                    method: "PATCH",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ status: "Done" }),
                                                  })
                                                    .then((res) => res.text())
                                                    .then(() => {
                                                      task.status = "Done";
                                                      setScheduledTasks((prev) => ({ ...prev }));
                                                    })
                                                    .catch((err) => console.error("❌ Failed to mark done:", err));
                                                }}
                                              >✅</button>
                                              <button
                                                className="remove-btn"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setScheduledTasks((prev) => {
                                                    const updated = { ...prev };
                                                    updated[slotId] = updated[slotId].filter(val => val !== String(task.id));
                                                    return updated;
                                                  });
                                                  fetch(`http://localhost:8080/api/tasks/${task.id}/schedule`, {
                                                    method: "PUT",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ scheduledTime: null }),
                                                  })
                                                    .then((res) => res.json())
                                                    .then((data) => console.log("🗑️ Unschedule successful:", data))
                                                    .catch((err) => console.error("❌ Error unscheduling task:", err));
                                                }}
                                              >❌</button>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              }
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    );
                  })}
                </div>
              ))}
            </div>
          </main>
        </div>
      </DragDropContext>
    </div>
  );
}