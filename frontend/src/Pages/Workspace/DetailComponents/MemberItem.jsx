import React from "react";
import styles from "./MemberItem.module.css";

export default function MemberItem({ member, workspaceColor, onRemove }) {
  return (
    <div className={styles.memberItem}>
      <div className={styles.memberHeader}>
        <div
          className={styles.avatar}
          style={{ backgroundColor: workspaceColor }}
        >
          {member.initials}
        </div>
        <div className={styles.memberInfo}>
          <h3 className={styles.memberName}>{member.name}</h3>
          <p className={styles.memberEmail}>{member.email}</p>
        </div>
        {onRemove && (
          <button 
            onClick={onRemove}
            className={styles.removeButton}
            aria-label="Remove member"
          >
            ×
          </button>
        )}
      </div>

      <div className={styles.memberDetails}>
        <span
          className={`${styles.role} ${
            member.role === "Creator"
              ? styles.roleCoordinator
              : styles.roleMember
          }`}
        >
          {member.role}
        </span>
        <span className={styles.tasksCount}>
          {member.tasksCount} {member.tasksCount === 1 ? "task" : "tasks"}
        </span>
      </div>
    </div>
  );
}
