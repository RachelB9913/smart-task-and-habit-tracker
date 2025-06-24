import React, { useEffect, useState } from "react";

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
  const [habitStats, setHabitStats] = useState({ week: 0 });
  const [taskStats, setTaskStats] = useState({ week: 0 });
  const [trigger, setTrigger] = useState(0); // Refresh trigger

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
    const taskWeek = taskCompletions.filter(entry => isSameWeek(entry.completedAt, now)).length;
    setTaskStats({ week: taskWeek });

    // Habit completions this week
    const habitCompletions = JSON.parse(localStorage.getItem("habitCompletions") || "[]");
    const habitWeek = habitCompletions.filter(entry => isSameWeek(entry.completedAt, now)).length;
    setHabitStats({ week: habitWeek });
  }, [trigger]);

  return (
    <div className="stats-panel">
      <h3>📊 Weekly Stats</h3>
      <p><strong>Habits completed:</strong> {habitStats.week} this week</p>
      <p><strong>Tasks completed:</strong> {taskStats.week} this week</p>
    </div>
  );
}
