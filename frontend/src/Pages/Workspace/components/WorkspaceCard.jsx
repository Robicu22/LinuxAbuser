import React from "react";
import { Link } from "react-router-dom";
import CoordinatorAvatar from "./CoordinatorAvatar";
import styles from "./WorkspaceCard.module.css";

export default function WorkspaceCard({ workspace }) {
  return (
    <div className={styles.workspaceCard}>
      <div
        className={styles.colorBar}
        style={{ backgroundColor: workspace.color }}
      ></div>

      <div className={styles.cardContent}>
        <div className={styles.header}>
          <h2 className={styles.workspaceName}>{workspace.name}</h2>
          <div
            className={styles.colorDot}
            style={{ backgroundColor: workspace.color }}
          ></div>
        </div>

        <div className={styles.coordinatorsSection}>
          <h3 className={styles.sectionTitle}>Coordinators</h3>
          <div className={styles.coordinatorsList}>
            {workspace.coordinators.map((coordinator, index) => (
              <CoordinatorAvatar
                key={index}
                coordinator={coordinator}
                color={workspace.color}
              />
            ))}
          </div>
        </div>

        <div className={styles.membersSection}>
          <div className={styles.memberCount}>
            <span className={styles.memberIcon}>👥</span>
            <span className={styles.memberText}>
              {workspace.memberCount}{" "}
              {workspace.memberCount === 1 ? "member" : "members"}
            </span>
          </div>
        </div>

        <p className={styles.description}>{workspace.description}</p>

        <Link to={`/workspaces/${workspace.id}`} className={styles.viewButton}>
          View Workspace
        </Link>
      </div>
    </div>
  );
}
