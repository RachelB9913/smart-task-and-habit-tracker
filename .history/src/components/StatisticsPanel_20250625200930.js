import React, { useEffect, useState, useRef } from "react";
import './StatisticsPanel.css';
import confetti from "canvas-confetti";

function isSameWeek(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const getStartOfWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };
  return getStartOfWeek(d1).toDateString() === getStartOfWeek(d2).toDateString();
}

const quotes = [
  "Every accomplishment starts with the decision to try.",
  "The secret of getting ahead is getting started.",
  "Progress, not perfection.",
  "Small steps every day lead to big results.",
  "Believe in yourself and all that you are.",
  "Success is the sum of small efforts repeated day in and day out.",
  "You are capable of amazing things.",
  "Your only limit is you.",
  "Dream big, work hard, stay focused.",
  "Success is not the key to happiness. Happiness is the key to success.",
  "The future depends on what you do today.",
  "Don't watch the clock; do what it does. Keep going.",
];

export default function StatisticsPanel() {
  const [habitStats, setHabitStats] = useState({ week: 0, total: 0 });
  const [taskStats, setTaskStats] = useState({ week: 0, total: 0 });
  const [trigger, setTrigger] = useState(0);
  const randomQuote = useRef(quotes[Math.floor(Math.random() * quotes.length)]);
  const [wasAllTasksDone, setWasAllTasksDone] = useState(false);
  const [wasAllHabitsDone, setWasAllHabitsDone] = useState(false);

  useEffect(() => {
    const handler = () => setTrigger((prev) => prev + 1);
    window.addEventListener("storage-updated", handler);
    return () => window.removeEventListener("storage-updated", handler);
  }, []);

  useEffect(() => {
    const now = new Date();
    const taskCompletions = JSON.parse(localStorage.getItem("taskCompletions") || "[]");
    const taskWeekDone = taskCompletions.filter(entry => isSameWeek(entry.completedAt, now)).length;

    const habitCompletions = JSON.parse(localStorage.getItem("habitCompletions") || "[]");
    const habitWeekDone = habitCompletions.filter(entry => isSameWeek(entry.completedAt, now)).length;

    const scheduled = JSON.parse(localStorage.getItem("scheduledItems") || "[]");
    const scheduledThisWeek = scheduled.filter(item => isSameWeek(item.scheduledAt, now));

    const taskWeekTotal = scheduledThisWeek.filter(item => item.type === "task").length;
    const habitWeekTotal = scheduledThisWeek.filter(item => item.type === "habit").length;

    setTaskStats({ week: taskWeekDone, total: taskWeekTotal });
    setHabitStats({ week: habitWeekDone, total: habitWeekTotal });
  }, [trigger]);

  const allTasksDone = taskStats.week === taskStats.total && taskStats.total > 0;
  const allHabitsDone = habitStats.week === habitStats.total && habitStats.total > 0;

  useEffect(() => {
    const fireConfetti = (x) => {
        confetti({
        particleCount: 300,
        spread: 50,
        origin: { x:0.87, y: 0.38 },
        });
    };

    if (allTasksDone && !wasAllTasksDone) {
        fireConfetti(0.89); // near stats panel
        setWasAllTasksDone(true);
    } else if (!allTasksDone) {
        setWasAllTasksDone(false);
    }

    if (allHabitsDone && !wasAllHabitsDone) {
        fireConfetti(0.89); // same position
        setWasAllHabitsDone(true);
    } else if (!allHabitsDone) {
        setWasAllHabitsDone(false);
    }
    }, [allTasksDone, allHabitsDone]);


  function getProgressColor(ratio, isDone) {
    if (isDone) return "gold";
    if (isNaN(ratio) || ratio === 0) return "#ccc";
    if (ratio < 0.5) return "#f1c40f";
    return "#2ecc71";
  }

  return (
    <div className="stats-wrapper">
    <div className="quote-panel">
      {randomQuote.current}
    </div>

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

        <div className={`stat-circle ${taskStats.week === taskStats.total && taskStats.total > 0 ? "full-gold" : ""}`}>
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

        <div className={`stat-circle ${habitStats.week === habitStats.total && habitStats.total > 0 ? "full-gold" : ""}`}>
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
    </div>
  );
}
