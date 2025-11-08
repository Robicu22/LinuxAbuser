import React from "react";
import styles from "./CoordinatorAvatar.module.css";

export default function CoordinatorAvatar({ coordinator, color }) {
  return (
    <div className={styles.coordinatorItem}>
      <div
        className={styles.avatar}
        style={{ backgroundColor: color }}
        title={coordinator.name}
      >
        {coordinator.initials}
      </div>
      <span className={styles.coordinatorName}>{coordinator.name}</span>
    </div>
  );
}
