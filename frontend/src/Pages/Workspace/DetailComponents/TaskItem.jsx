import React from "react";
import styles from "./TaskItem.module.css";

export default function TaskItem({ task, workspaceColor }) {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return styles.priorityHigh;
      case "Medium":
        return styles.priorityMedium;
      case "Low":
        return styles.priorityLow;
      default:
        return "";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Done":
        return styles.statusDone;
      case "In Progress":
        return styles.statusInProgress;
      case "To Do":
        return styles.statusToDo;
      default:
        return "";
    }
  };

  return (
    <div className={styles.taskItem}>
      <div className={styles.taskHeader}>
        <h3 className={styles.taskName}>{task.name}</h3>
        <span
          className={`${styles.priority} ${getPriorityClass(task.priority)}`}
        >
          {task.priority}
        </span>
      </div>

      <div className={styles.taskDetails}>
        <span className={`${styles.status} ${getStatusClass(task.status)}`}>
          {task.status}
        </span>
        <span className={styles.assignee}>👤 {task.assignee}</span>
        <span className={styles.dueDate}>
          📅 {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
