import React from "react";
import styles from "./TaskCard.module.css";

export default function TaskCard({ task }) {
  return (
    <div className={styles.taskCard}>
      <div className={styles.taskHeader}>
        <span
          className={`${styles.priority} ${styles[`priority${task.priority}`]}`}
        >
          {task.priority}
        </span>
        <span
          className={styles.workspace}
          style={{ backgroundColor: task.workspaceColor }}
        >
          {task.workspace}
        </span>
      </div>
      <h3 className={styles.taskName}>{task.name}</h3>
      <p className={styles.taskDescription}>{task.description}</p>
      <div className={styles.taskFooter}>
        <span className={styles.deadline}>
          📅 {new Date(task.deadline).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
