import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskCard from "./TaskCard";
import styles from "./RecentTasks.module.css";

export default function RecentTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecentTasks();
  }, []);

  const fetchRecentTasks = async () => {
    try {
      setLoading(true);
      setError("");

      // Get user from localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError("Please log in to view tasks");
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      const response = await axios.get(`http://localhost:5000/api/tasks/recent?userId=${user.id}`);
      
      console.log("Recent tasks fetched:", response.data);
      const tasksData = response.data.tasks || response.data;
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (error) {
      console.error("Error fetching recent tasks:", error);
      setError("Failed to load tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.tasksSection}>
        <h2 className={styles.mainTitle}>Recent Tasks</h2>
        <div className={styles.loadingMessage}>Loading tasks...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.tasksSection}>
        <h2 className={styles.mainTitle}>Recent Tasks</h2>
        <div className={styles.errorMessage}>{error}</div>
      </section>
    );
  }

  return (
    <section className={styles.tasksSection}>
      <h2 className={styles.mainTitle}>Recent Tasks</h2>
      <div className={styles.tasksScroll}>
        {tasks.length === 0 ? (
          <p className={styles.emptyMessage}>No tasks yet. Create your first task!</p>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))
        )}
      </div>
    </section>
  );
}
