import React from "react";
import { Link } from "react-router-dom";
import CoordinatorAvatar from "./CoordinatorAvatar";
import styles from "./WorkspaceCard.module.css";

export default function WorkspaceCard({ workspace, onDelete }) {
  // Get creator initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const creatorName = workspace.createdBy?.name || "Unknown";
  const creatorInitials = getInitials(creatorName);
  const memberCount = workspace.members?.length || 0;

  return (
    <div className={styles.workspaceCard}>
      <div
        className={styles.colorBar}
        style={{ backgroundColor: workspace.color }}
      ></div>

      {onDelete && (
        <button
          className={styles.deleteButton}
          onClick={() => onDelete(workspace._id)}
          aria-label="Delete workspace"
        >
          ×
        </button>
      )}

      <div className={styles.cardContent}>
        <div className={styles.header}>
          <h2 className={styles.workspaceName}>{workspace.name}</h2>
          <div
            className={styles.colorDot}
            style={{ backgroundColor: workspace.color }}
          ></div>
        </div>

        <div className={styles.coordinatorsSection}>
          <h3 className={styles.sectionTitle}>Creator</h3>
          <div className={styles.coordinatorsList}>
            <CoordinatorAvatar
              coordinator={{ name: creatorName, initials: creatorInitials }}
              color={workspace.color}
            />
          </div>
        </div>

        <div className={styles.membersSection}>
          <div className={styles.memberCount}>
            <span className={styles.memberIcon}>👥</span>
            <span className={styles.memberText}>
              {memberCount}{" "}
              {memberCount === 1 ? "member" : "members"}
            </span>
          </div>
        </div>

        <p className={styles.description}>{workspace.description || "No description provided"}</p>

        <Link to={`/workspaces/${workspace._id}`} className={styles.viewButton}>
          View Workspace
        </Link>
      </div>
    </div>
  );
}
