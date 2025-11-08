import React from "react";
import styles from "./TaskItem.module.css";

export default function TaskItem({ task, workspaceColor, currentUser, onAcceptTask, onToggleTask, onDeleteTask }) {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Urgent":
        return styles.priorityUrgent;
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

  const isAdmin = currentUser?.role === 'admin';
  const isAssignedToUser = task.assignedTo?._id === currentUser?.id;
  const canComplete = isAdmin || isAssignedToUser;

  return (
    <div className={styles.taskItem}>
      <div className={styles.taskHeader}>
        <div className={styles.taskTitleRow}>
          {onToggleTask && (
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={task.completed}
              onChange={() => onToggleTask(task._id)}
              disabled={!canComplete}
              title={!canComplete ? "Only the assigned user can complete this task" : ""}
            />
          )}
          <h3 className={styles.taskName}>{task.name}</h3>
        </div>
        <span className={`${styles.priority} ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className={styles.taskDescription}>{task.description}</p>
      )}

      <div className={styles.taskDetails}>
        <span className={styles.status}>
          {task.completed ? " Completed" : " Pending"}
        </span>
        {task.deadline && (
          <span className={styles.dueDate}>
             {new Date(task.deadline).toLocaleDateString()}
          </span>
        )}
        {task.category && (
          <span className={styles.category}>{task.category}</span>
        )}
        {task.assignedTo && (
          <span className={styles.assignedTo}>
             {task.assignedTo.name}
          </span>
        )}
      </div>

      <div className={styles.actions}>
        {onAcceptTask && (
          <button 
            className={styles.acceptButton}
            onClick={() => onAcceptTask(task._id)}
          >
            Accept Task
          </button>
        )}
        {onDeleteTask && (
          <button 
            className={styles.deleteButton}
            onClick={() => onDeleteTask(task._id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
