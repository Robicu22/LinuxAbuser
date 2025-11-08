import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../../config/api";
import MonthYearPicker from "./MonthYearPicker";
import styles from "./Calendar.module.css";

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
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [currentMonth, currentYear]);

  async function fetchTasks() {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        console.error("No user found in localStorage");
        setTasks([]);
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      const response = await axios.get(`${API_URL}/tasks?userId=${user.id}`);
      // Backend returns { tasks: [...] }
      const tasksData = response.data.tasks || response.data;
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

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
  if (Array.isArray(tasks)) {
    tasks.forEach((task) => {
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
  }

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
                key={task._id || task.id}
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
