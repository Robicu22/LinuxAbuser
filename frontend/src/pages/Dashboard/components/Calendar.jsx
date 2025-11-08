import React from "react";
import styles from "./Calendar.module.css";

const sampleTasks = [
  {
    id: 1,
    name: "Task Example 1",
    description: "Users can't login with special characters",
    workspace: "Workspace Example 1",
    workspaceColor: "#3b82f6",
    priority: "High",
    deadline: "2025-11-10",
  },
  {
    id: 2,
    name: "Task Example 2",
    description: "Redesign dashboard with new color scheme",
    workspace: "Workspace Example 2",
    workspaceColor: "#10b981",
    priority: "Medium",
    deadline: "2025-11-15",
  },
  {
    id: 3,
    name: "Task Example 3",
    description: "Optimize query performance for user analytics",
    workspace: "Workspace Example 3",
    workspaceColor: "#f59e0b",
    priority: "Low",
    deadline: "2025-11-20",
  },
  {
    id: 4,
    name: "Task Example 4",
    description: "Conduct security review of authentication flow",
    workspace: "Workspace Example 4",
    workspaceColor: "#ef4444",
    priority: "High",
    deadline: "2025-11-12",
  },
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month, year) {
  return new Date(year, month, 1).getDay();
}

export default function Calendar() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = currentDate.getDate();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  // Create a map of tasks by deadline
  const tasksByDate = {};
  sampleTasks.forEach((task) => {
    const date = new Date(task.deadline);
    if (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    ) {
      const day = date.getDate();
      if (!tasksByDate[day]) {
        tasksByDate[day] = [];
      }
      tasksByDate[day].push(task);
    }
  });

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(
      <div key={`empty-${i}`} className={styles.calendarDayEmpty}></div>
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today;
    const hasTasks = tasksByDate[day];

    calendarDays.push(
      <div
        key={day}
        className={`${styles.calendarDay} ${isToday ? styles.today : ""}`}
      >
        <span className={styles.dayNumber}>{day}</span>
        {hasTasks && (
          <div className={styles.taskDots}>
            {hasTasks.map((task) => (
              <span
                key={task.id}
                className={styles.taskDot}
                style={{ backgroundColor: task.workspaceColor }}
                title={task.name}
              ></span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className={styles.calendarSection}>
      <h2 className={styles.mainTitle}>
        {monthNames[currentMonth]} {currentYear}
      </h2>
      <div className={styles.calendarGrid}>
        <div className={styles.calendarHeader}>Sun</div>
        <div className={styles.calendarHeader}>Mon</div>
        <div className={styles.calendarHeader}>Tue</div>
        <div className={styles.calendarHeader}>Wed</div>
        <div className={styles.calendarHeader}>Thu</div>
        <div className={styles.calendarHeader}>Fri</div>
        <div className={styles.calendarHeader}>Sat</div>
        {calendarDays}
      </div>
    </section>
  );
}
