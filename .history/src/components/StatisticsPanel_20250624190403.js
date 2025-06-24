import React, { useEffect, useState } from "react";

export default function StatisticsPanel() {
  const [habitStats, setHabitStats] = useState({
    week: 0,
    month: 0,
    total: 0,
  });

  const [taskStats, setTaskStats] = useState({
    week: 0,
    month: 0,
    total: 0,
  });

  return (
    <div className="stats-panel">
      <h3>📊 Statistics</h3>
      <p><strong>Habits:</strong> {habitStats.week} this week · {habitStats.month} this month · {habitStats.total} total</p>
      <p><strong>Tasks:</strong> {taskStats.week} this week · {taskStats.month} this month · {taskStats.total} total</p>
    </div>
  );
}