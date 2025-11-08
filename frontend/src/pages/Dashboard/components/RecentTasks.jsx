import React from "react";
import TaskCard from "./TaskCard";
import styles from "./RecentTasks.module.css";

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

export default function RecentTasks() {
  return (
    <section className={styles.tasksSection}>
      <h2 className={styles.mainTitle}>Recent Tasks</h2>
      <div className={styles.tasksScroll}>
        {sampleTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}
