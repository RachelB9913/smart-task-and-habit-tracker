import React, { useEffect, useState } from "react";
import './StatisticsPanel.css';

// Helper to check if two dates fall in the same week (starting Monday)
function isSameWeek(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);

  const getStartOfWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust for Monday start
    return new Date(date.setDate(diff));
  };

  return getStartOfWeek(d1).toDateString() === getStartOfWeek(d2).toDateString();
}

export default function StatisticsPanel() {
  const [habitStats, setHabitStats] = useState({ week: 0, total: 0 });
  const [taskStats, setTaskStats] = useState({ week: 0, total: 0 });
  const [trigger, setTrigger] = useState(0); // Refresh trigger
  
  const taskWeekDone = taskStats.week;
  const taskWeekTotal = taskStats.total;
  const habitWeekDone = habitStats.week;
  const habitWeekTotal = habitStats.total;

  const allTasksDone = taskWeekDone === taskWeekTotal && taskWeekTotal > 0;
  const allHabitsDone = habitWeekDone === habitWeekTotal && habitWeekTotal > 0;

  // Refresh on custom event
  useEffect(() => {
    const handler = () => setTrigger((prev) => prev + 1);
    window.addEventListener("storage-updated", handler);
    return () => window.removeEventListener("storage-updated", handler);
  }, []);

  // Compute weekly statistics
  useEffect(() => {
    const now = new Date();

    // Task completions this week
    const taskCompletions = JSON.parse(localStorage.getItem("taskCompletions") || "[]");
    const taskWeekDone = taskCompletions.filter(entry => isSameWeek(entry.completedAt, now)).length;

    // Habit completions this week
    const habitCompletions = JSON.parse(localStorage.getItem("habitCompletions") || "[]");
    const habitWeekDone = habitCompletions.filter(entry => isSameWeek(entry.completedAt, now)).length;

    // Scheduled items this week
    const scheduled = JSON.parse(localStorage.getItem("scheduledItems") || "[]");
    const scheduledThisWeek = scheduled.filter(item => isSameWeek(item.scheduledAt, now));

    const taskWeekTotal = scheduledThisWeek.filter(item => item.type === "task").length;
    const habitWeekTotal = scheduledThisWeek.filter(item => item.type === "habit").length;

    setTaskStats({ week: taskWeekDone, total: taskWeekTotal });
    setHabitStats({ week: habitWeekDone, total: habitWeekTotal });
    }, [trigger]);

function getProgressColor(ratio) {
  if (isNaN(ratio) || ratio === 0) return "#ccc";     // gray for 0/0 or 0%
  if (ratio < 0.5) return "#f1c40f";                   // yellow if < 50%
  return "#2ecc71";                                    // green if ≥ 50%
}

  return (
  <div className="stats-panel">
    <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>📊 Weekly Progress - Some Stats</h3>
    <div className="legend">
        <div className="legend-item">
            <span className="dot green"></span> ≥ 50% completed
        </div>
        <div className="legend-item">
            <span className="dot yellow"></span> &lt; 50% completed
        </div>
        <div className="legend-item">
            <span className="dot gray"></span> Not started
        </div>
    </div>

    {(allTasksDone || allHabitsDone) && (
        <div className="celebration-message">
            🎉 {allTasksDone && allHabitsDone
            ? "You completed ALL your tasks and habits this week!"
            : allTasksDone
            ? "All tasks completed – amazing work! ✅"
            : "All habits completed – you're crushing it! 💪"}
        </div>
    )}

    <div className="stat-circle">
      <svg>
        <circle className="stat-bg" cx="70" cy="70" r="60" />
        <circle
            className="stat-fill"
            cx="70"
            cy="70"
            r="60"
            stroke={getProgressColor(taskStats.week / taskStats.total || 0)}
            strokeDasharray={2 * Math.PI * 60}
            strokeDashoffset={(1 - (taskStats.week / taskStats.total || 0)) * 2 * Math.PI * 60}
            />
      </svg>
      <div className="stat-label">
        <div>Tasks</div>
        <div>{taskStats.week} / {taskStats.total}</div>
      </div>
    </div>

    <div className="stat-circle">
      <svg>
        <circle className="stat-bg" cx="70" cy="70" r="60" />
        <circle
            className="stat-fill"
            cx="70"
            cy="70"
            r="60"
            stroke={getProgressColor(habitStats.week / habitStats.total || 0)}
            strokeDasharray={2 * Math.PI * 60}
            strokeDashoffset={(1 - (habitStats.week / habitStats.total || 0)) * 2 * Math.PI * 60}
            />
      </svg>
      <div className="stat-label">
        <div>Habits</div>
        <div>{habitStats.week} / {habitStats.total}</div>
      </div>
    </div>
  </div>
);
}