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
  morning: [6, 7, 8, 9, 10],       // 6AM–10AM
  noon: [11, 12, 13, 14],          // 11AM–2PM
  evening: [17, 18, 19, 20, 21],   // 5PM–9PM
};

function getPreferredHours(preferredTime) {
  if (!preferredTime) return [];

  // Case: exact time string like "14:00"
  if (preferredTime.includes(":")) {
    const hour = parseInt(preferredTime.split(":")[0], 10);
    return [hour];
  }

  // Case: general time block like "morning"
  const block = timeBlocks[preferredTime.toLowerCase()];
  return block || [];
}

const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function getDaysFromFrequency(freq) {
  if (!freq) return [];

  if (freq === "Daily") return allDays;

  // Case: custom days like "Mon,Wed,Fri"
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

  // Case: "Every 3 days"
  const match = freq.match(/Every (\d+) days/);
  if (match) {
    const step = parseInt(match[1], 10);
    return allDays.filter((_, idx) => idx % step === 0);
  }

  return [];
}

function autoPlaceHabits(habits, currentSchedule, tasks) {
  const newSchedule = { ...currentSchedule };

  habits.forEach(habit => {
    if (!habit.frequency || !habit.preferredTime) return;

    const candidateDays = getDaysFromFrequency(habit.frequency);
    const candidateHours = getPreferredHours(habit.preferredTime);

    for (const day of candidateDays) {
      for (const hour of candidateHours) {
        const slotKey = `${day}-${hour}:00`;

        const isSlotTaken = Object.keys(newSchedule).includes(slotKey) ||
          tasks.some(t => t.scheduledTime === slotKey);

        if (!isSlotTaken) {
          newSchedule[slotKey] = `habit-${habit.id}`;
          break;
        }
      }
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

  const saveSchedule = () => {
    localStorage.setItem("savedSchedule", JSON.stringify(scheduledTasks));
    alert("Schedule saved!");
  };

  const handleAutoPlace = () => {
    const newSchedule = autoPlaceHabits(habits, scheduledTasks, tasks);
    setScheduledTasks(newSchedule);
    localStorage.setItem("savedSchedule", JSON.stringify(newSchedule));
  };

  const scheduledTasksByTime = {};
  tasks.forEach(task => {
    if (task.scheduledTime) {
      const [day, time] = task.scheduledTime.split(" ");
      const key = `${day}-${time}`;
      if (!scheduledTasksByTime[key]) {
        scheduledTasksByTime[key] = [];
      }
      scheduledTasksByTime[key].push(task);
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem("savedSchedule");
    if (saved) setScheduledTasks(JSON.parse(saved));
  }, []);

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

        const initialSchedule = {};
        taskDetails.forEach(task => {
          if (task.scheduledTime) {
            initialSchedule[task.scheduledTime] = String(task.id);
          }
        });
        setScheduledTasks(initialSchedule);
      })
      .catch(err => console.error("Failed to load tasks:", err));
  }, []);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    setScheduledTasks((prev) => {
      const updated = { ...prev };

      // Remove task from previous slot if it was scheduled before
      Object.keys(updated).forEach((key) => {
        if (updated[key] === draggableId) {
          delete updated[key];
        }
      });

      // Add to the new slot
      updated[destination.droppableId] = draggableId;

      fetch(`http://localhost:8080/api/tasks/${draggableId}/schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledTime: destination.droppableId }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to schedule task");
          return res.json();
        })
        .then((data) => console.log("✅ Scheduled:", data))
        .catch((err) => console.error("❌ Error scheduling task:", err));

      return updated;
    });
  };

  return (
    <div className="dashboard-container light">
      <header className="dashboard-header">
        <div className="header-left">
          <h2>🗓️ Weekly Planner</h2>
        </div>
        <div className="header-right">
          <button onClick={() => navigate("/dashboard")} className="logout-button">
            Back to Dashboard
          </button>
        </div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="planner-container">
          <aside className="task-sidebar">
            <div className="save-button-container">
              <div className="save-button-container vertical-buttons">
                <button className="save-button" onClick={saveSchedule}>💾 Save Schedule</button>
                <button className="save-button" onClick={handleAutoPlace}>✨ Auto Place Habits</button>
              </div>
            </div>
            <h3>Tasks</h3>
            <Droppable droppableId="taskList">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {tasks.map((task, index) => {
                    const isScheduled = Object.values(scheduledTasks).includes(String(task.id));
                    return (
                      <Draggable
                        draggableId={String(task.id)}
                        index={index}
                        key={`${task.id}-${isScheduled ? "scheduled" : "unscheduled"}`}
                      >
                        {(provided, snapshot) => (
                          <li
                            className={`task-item ${isScheduled || task.status === "Done" ? "grayed-out" : ""}`}
                            style={snapshot.isDragging ? { boxShadow: '0 0 6px #999' } : {}}
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
                    {habits.map((task, index) => {
                      const isScheduled = Object.values(scheduledTasks).includes(String(task.id));
                      return (
                        <Draggable
                          draggableId={String(task.id)}
                          index={index}
                          key={`${task.id}-${isScheduled ? "scheduled" : "unscheduled"}`}
                        >
                          {(provided, snapshot) => (
                            <li
                              className={`task-item ${isScheduled ? "grayed-out" : ""}`}
                              style={snapshot.isDragging ? { boxShadow: '0 0 6px #999' } : {}}
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
          </aside>

          <main className="calendar-grid">
            <div className="grid-header">
              <div className="cell hour-cell"></div>
              {days.map((day) => (
                <div key={day} className="cell day-cell">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid-body">
              {hours.map((hour) => (
                <div className="row" key={hour}>
                  <div className="cell hour-cell">{hour}:00</div>
                  {days.map((day) => {
                    const slotId = `${day}-${hour}:00`;
                    const taskId = scheduledTasks[slotId];
                    const task = tasks.find((t) => String(t.id) === taskId);

                    return (
                      <Droppable droppableId={slotId} key={slotId}>
                        {(provided, snapshot) => (
                          <div
                            className={`cell time-slot ${snapshot.isDraggingOver ? "drag-over" : ""}`}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {task && (
                              <Draggable draggableId={String(task.id)} index={0}>
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
                                                .then((res) => {
                                                  if (!res.ok) throw new Error("Failed to mark done");
                                                  return res.text();
                                                })
                                                .then(() => {
                                                  task.status = "Done";
                                                  setScheduledTasks((prev) => ({ ...prev }));
                                                })
                                                .catch((err) => console.error("❌ Failed to mark done:", err));
                                            }}
                                          >
                                            ✅
                                          </button>

                                          <button
                                            className="remove-btn"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setScheduledTasks((prev) => {
                                                const updated = { ...prev };
                                                delete updated[slotId];
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
                                          >
                                            ❌
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            )}

                            {(scheduledTasksByTime[slotId] || []).map((t) => (
                              (!task || t.id !== task.id) && (
                                <div key={t.id} className="scheduled-task db-task">
                                  {t.title}
                                </div>
                              )
                            ))}

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
