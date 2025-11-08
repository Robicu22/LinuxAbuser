import { useState } from "react";
import styles from "./task.module.css";

export default function Task({ task, currentUser, onToggle, onDelete, onAccept, onEdit }) {
  const [showDetails, setShowDetails] = useState(false);

  // Determine if the user can complete this task
  const isAdmin = currentUser?.role === 'admin';
  const isAssignedToUser = task.assignedTo?._id === currentUser?.id;
  const canComplete = isAdmin || isAssignedToUser;

  return (
    <div
      className={`${styles.taskItem} ${task.completed ? styles.completed : ""}`}
    >
      <div className={styles.taskContent}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={task.completed}
          onChange={() => onToggle(task._id || task.id)}
          disabled={!canComplete}
          title={!canComplete ? "Only the assigned user can complete this task" : ""}
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
              {task.assignedTo && (
                <span className={styles.assignedBadge}>
                  Assigned: {task.assignedTo.name}
                </span>
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
              {(task.deadline || task.endDate) && (
                <div className={styles.detailItem}>
                  <strong>End Date:</strong>{" "}
                  {new Date(task.deadline || task.endDate).toLocaleDateString("en-GB")}
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
        {onAccept && (
          <button
            className={styles.acceptButton}
            onClick={() => onAccept(task._id || task.id)}
            aria-label="Accept task"
          >
            Accept Task
          </button>
        )}
        {(task.startDate || task.deadline || task.endDate || task.description) && (
          <button
            className={styles.detailsButton}
            onClick={() => setShowDetails(!showDetails)}
            aria-label="Toggle details"
          >
            {showDetails ? "▲" : "▼"}
          </button>
        )}
        {isAdmin && onEdit && (
          <button
            className={styles.editButton}
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            ✎
          </button>
        )}
        <button
          className={styles.deleteButton}
          onClick={() => onDelete(task._id || task.id)}
          aria-label="Delete task"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
