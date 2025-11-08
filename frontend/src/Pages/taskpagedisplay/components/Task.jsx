import { useState } from "react";
import styles from "./task.module.css";

export default function Task({ task, onToggle, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className={`${styles.taskItem} ${task.completed ? styles.completed : ""}`}
    >
      <div className={styles.taskContent}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <div className={styles.taskInfo}>
          <span className={styles.taskText}>{task.name}</span>
          {(task.category || task.workspace) && (
            <div className={styles.taskMeta}>
              {task.category && (
                <span className={styles.badge}>{task.category}</span>
              )}
              {task.workspace && (
                <span className={styles.workspaceBadge}>{task.workspace}</span>
              )}
            </div>
          )}
          {showDetails && (
            <div className={styles.details}>
              {task.startDate && (
                <div className={styles.detailItem}>
                  <strong>Start Date:</strong>{" "}
                  {new Date(task.startDate).toLocaleDateString("en-GB")}
                </div>
              )}
              {task.endDate && (
                <div className={styles.detailItem}>
                  <strong>End Date:</strong>{" "}
                  {new Date(task.endDate).toLocaleDateString("en-GB")}
                </div>
              )}
              {task.description && (
                <div className={styles.detailItem}>
                  <strong>Description:</strong> {task.description}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.actions}>
        {(task.startDate || task.endDate || task.description) && (
          <button
            className={styles.detailsButton}
            onClick={() => setShowDetails(!showDetails)}
            aria-label="Toggle details"
          >
            {showDetails ? "▲" : "▼"}
          </button>
        )}
        <button
          className={styles.deleteButton}
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
