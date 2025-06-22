// SchedulePlanner.js
import React, { useState } from "react";
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

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const slotId = destination.droppableId;

    setScheduledTasks((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach((key) => {
            if (updated[key] === draggableId) {
            delete updated[key];
            }
        });

        updated[destination.droppableId] = draggableId;

        return updated;
        });

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
            <h3>Tasks</h3>
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
                            className="scheduled-task"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            >
                            <span>{task.title}</span>
                            <button
                                className="remove-btn"
                                onClick={(e) => {
                                e.stopPropagation();
                                setScheduledTasks((prev) => {
                                    const updated = { ...prev };
                                    delete updated[slotId];
                                    return updated;
                                });
                                }}
                            >
                                ❌
                            </button>
                            </div>
                        )}
                        </Draggable>
                    )}
                    {provided.placeholder}
                    </div>
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
                    const slotId = `${day}-${hour}`;
                    const taskId = scheduledTasks[slotId];
                    const task = tasks.find((t) => String(t.id) === taskId);

                    return (
                      <Droppable droppableId={slotId} key={slotId}>
                        {(provided) => (
                          <div
                            className="cell time-slot"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                           {task && (
                                <div className="scheduled-task">
                                    <span>{task.title}</span>
                                    <button
                                    className="remove-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setScheduledTasks((prev) => {
                                        const updated = { ...prev };
                                        delete updated[slotId];
                                        return updated;
                                        });
                                    }}
                                    >
                                    ❌
                                    </button>
                                </div>
                                )}
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
