import React, { useEffect, useState } from "react";

function isSameWeek(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);

  const getStartOfWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay(); // Sunday = 0
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust Sunday to Monday
    return new Date(date.setDate(diff));
  };

  return getStartOfWeek(d1).toDateString() === getStartOfWeek(d2).toDateString();
}

export default function StatisticsPanel() {
  const [habitStats, setHabitStats] = useState({ week: 0 });
  const [taskStats, setTaskStats] = useState({ week: 0 });

  useEffect(() => {
    const now = new Date();

    const habitCompletions = JSON.parse(localStorage.getItem("habitCompletions") || "[]");
    const taskCompletions = JSON.parse(localStorage.getItem("taskCompletions") || "[]");

    const habitWeek = habitCompletions.filter(h => isSameWeek(h.completedAt, now)).length;
    const habitMonth = habitCompletions.filter(h => isSameMonth(h.completedAt, now)).length;

    const taskWeek = taskCompletions.filter(t => isSameWeek(t.completedAt, now)).length;
    const taskMonth = taskCompletions.filter(t => isSameMonth(t.completedAt, now)).length;

    setHabitStats({
      week: habitWeek,
      month: habitMonth,
      total: habitCompletions.length,
    });

    setTaskStats({
      week: taskWeek,
      month: taskMonth,
      total: taskCompletions.length,
    });
  }, []);

  useEffect(() => {
    const now = new Date();

    // ---- TASKS ----
    const taskCompletions = JSON.parse(localStorage.getItem("taskCompletions") || "[]");
    const taskWeek = taskCompletions.filter(entry => isSameWeek(entry.completedAt, now)).length;
    setTaskStats({ week: taskWeek });

    // ---- HABITS ----
    const habitCompletions = JSON.parse(localStorage.getItem("habitCompletions") || "[]");
    const habitWeek = habitCompletions.filter(entry => isSameWeek(entry.completedAt, now)).length;
    setHabitStats({ week: habitWeek });

    }, []);

    return (
    <div className="stats-panel">
        <h3>📊 Weekly Stats</h3>
        <p><strong>Habits completed:</strong> {habitStats.week} this week</p>
        <p><strong>Tasks completed:</strong> {taskStats.week} this week</p>
    </div>
    );
}
