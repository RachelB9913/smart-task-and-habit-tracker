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

export default function SchedulePlanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const tasks = location.state?.tasks || [];
  const [scheduledTasks, setScheduledTasks] = useState({});

  const saveSchedule = () => {
    localStorage.setItem("savedSchedule", JSON.stringify(scheduledTasks));
    alert("Schedule saved!");
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
              <button className="save-button" onClick={saveSchedule}>
                💾 Save Schedule
              </button>
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
                      <Droppable droppableId="taskList" isDropDisabled={true}>
  {(provided) => (
    <ul {...provided.droppableProps} ref={provided.innerRef}>
      {tasks.map((task, index) => {
        const isGrayed = !!task.scheduledTime;

        return isGrayed ? (
          <li key={task.id} className="task-item grayed-out">
            {task.title}
          </li>
        ) : (
          <Draggable draggableId={String(task.id)} index={index} key={task.id}>
            {(provided, snapshot) => (
              <li
                className="task-item"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={{
                  ...provided.draggableProps.style,
                  boxShadow: snapshot.isDragging ? "0 0 6px #999" : "none",
                }}
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
