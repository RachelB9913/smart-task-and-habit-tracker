import React, { useEffect, useState } from "react";

function isSameWeek(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);

  const startOfWeek1 = d1.getDate() - d1.getDay();
  const startOfWeek2 = d2.getDate() - d2.getDay();

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    startOfWeek1 === startOfWeek2
  );
}

function isSameMonth(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
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
      <h3>📊 Statistics</h3>
      <p><strong>Habits:</strong> {habitStats.week} this week · {habitStats.month} this month · {habitStats.total} total</p>
      <p><strong>Tasks:</strong> {taskStats.week} this week · {taskStats.month} this month · {taskStats.total} total</p>
    </div>
  );
}
