import React from "react";
import styles from "./Sidebar.module.css";

const recentWorkspaces = [
  { id: 1, name: "Workspace Example 1", color: "#3b82f6", tasks: 12 },
  { id: 2, name: "Workspace Example 2", color: "#10b981", tasks: 8 },
  { id: 3, name: "Workspace Example 3", color: "#f59e0b", tasks: 5 },
  { id: 4, name: "Workspace Example 4", color: "#ef4444", tasks: 3 },
  { id: 5, name: "Workspace Example 5", color: "#8b5cf6", tasks: 6 },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.profile}>
        <div className={styles.avatar}>R</div>
        <h3 className={styles.profileName}>Radu</h3>
        <p className={styles.profileRole}>Developer</p>
      </div>
      <nav className={styles.nav}>
        <a href="/dashboard" className={`${styles.navLink} ${styles.active}`}>
          <span className={styles.navIcon}>🏠</span>
          Home
        </a>
        <a href="/workspaces" className={styles.navLink}>
          <span className={styles.navIcon}>📁</span>
          Workspaces
        </a>
        <a href="/tasks" className={styles.navLink}>
          <span className={styles.navIcon}>📝</span>
          Task Overview
        </a>
        <a href="/tasks" className={styles.navLink}>
          <span className={styles.navIcon}>➕</span>
          Create Task
        </a>
      </nav>
      <div className={styles.recentWorkspaces}>
        <h4 className={styles.sectionTitle}>Recent Workspaces</h4>
        <ul className={styles.workspaceList}>
          {recentWorkspaces.map((ws) => (
            <li key={ws.id} className={styles.workspaceItem}>
              <span
                className={styles.workspaceDot}
                style={{ backgroundColor: ws.color }}
              ></span>
              <div className={styles.workspaceInfo}>
                <span className={styles.workspaceName}>{ws.name}</span>
                <span className={styles.workspaceCount}>{ws.tasks} tasks</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
