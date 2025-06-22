import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./SchedulePlanner.css";
import "../Dashboard.css";

const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6 to 23
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


export default function SchedulePlanner() {
  const location = useLocation(); 
  const navigate = useNavigate();
  const [scheduledTasks, setScheduledTasks] = useState({});


  const tasks = location.state?.tasks || [];


  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const slotId = destination.droppableId;
    setScheduledTasks((prev) => ({
        ...prev,
        [slotId]: draggableId,
    }));
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

      <div className="planner-container">
        <aside className="task-sidebar">
            <h3>Tasks</h3>

            <Droppable droppableId="taskList">
                {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                    {tasks.map((task, index) => (
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
                    ))}
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
                {days.map((day) => (
                  <div key={`${day}-${hour}`} className="cell time-slot"></div>
                ))}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
