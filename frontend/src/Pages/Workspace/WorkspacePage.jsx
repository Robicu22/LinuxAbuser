import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import WorkspaceCard from "./components/WorkspaceCard";
import Sidebar from "../Dashboard/components/Sidebar";
import styles from "./WorkspacePage.module.css";

export default function WorkspacePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchWorkspaces();
  }, []);

  async function fetchWorkspaces() {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        console.error("No user found in localStorage");
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      const response = await axios.get(`http://localhost:5000/api/workspaces?userId=${user.id}`);
      console.log("Workspaces fetched:", response.data);
      setWorkspaces(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  }

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
          {loading ? (
            <p className={styles.emptyMessage}>Loading workspaces...</p>
          ) : workspaces.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyMessage}>
                No workspaces available yet.
              </p>
              {user?.role === 'admin' && (
                <Link to="/workspace-admin" className={styles.adminLink}>
                  Go to Workspace Admin
                </Link>
              )}
            </div>
          ) : (
            workspaces.map((workspace) => (
              <WorkspaceCard key={workspace._id} workspace={workspace} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
