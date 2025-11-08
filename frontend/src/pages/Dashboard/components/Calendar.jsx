import React, { useState } from "react";
import MonthYearPicker from "./MonthYearPicker";
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
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showPicker, setShowPicker] = useState(false);

  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateSelect = (month, year) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

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
    const isToday =
      day === todayDay &&
      currentMonth === todayMonth &&
      currentYear === todayYear;
    const hasTasks = tasksByDate[day];

    calendarDays.push(
      <div
        key={day}
        className={`${styles.calendarDay} ${isToday ? styles.today : ""}`}
      >
        <span className={styles.dayNumber}>{day}</span>
        {hasTasks && (
          <div className={styles.taskLines}>
            {hasTasks.map((task) => (
              <span
                key={task.id}
                className={styles.taskLine}
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
      <div className={styles.header}>
        <button className={styles.navBtn} onClick={goToPreviousMonth}>
          ‹
        </button>
        <h2 className={styles.mainTitle} onClick={() => setShowPicker(true)}>
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button className={styles.navBtn} onClick={goToNextMonth}>
          ›
        </button>
      </div>
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

      <MonthYearPicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        currentMonth={currentMonth}
        currentYear={currentYear}
        onSelect={handleDateSelect}
      />
    </section>
  );
}
