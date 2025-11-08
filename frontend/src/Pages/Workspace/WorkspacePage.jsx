import React, { useState } from "react";
import { Link } from "react-router-dom";
import WorkspaceCard from "./components/WorkspaceCard";
import Sidebar from "../Dashboard/components/Sidebar";
import styles from "./WorkspacePage.module.css";

export default function WorkspacePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [workspaces] = useState([]);

  return (
    <div className={styles.workspacePage}>
      <button
        className={styles.menuButton}
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>All Workspaces</h1>
          <p className={styles.subtitle}>Browse your team workspaces</p>
        </header>

        <div className={styles.workspaceGrid}>
          {workspaces.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyMessage}>
                No workspaces available yet.
              </p>
              <Link to="/workspace-admin" className={styles.adminLink}>
                Go to Workspace Admin
              </Link>
            </div>
          ) : (
            workspaces.map((workspace) => (
              <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
