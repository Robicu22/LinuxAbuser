import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Sidebar.module.css";

export default function Sidebar({ isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const navigate = useNavigate();

  // Get current path from window.location
  const currentPath = window.location.pathname;

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Fetch workspaces when user is loaded
        fetchWorkspaces(userData.id);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Fetch user's workspaces
  const fetchWorkspaces = async (userId) => {
    try {
      setLoadingWorkspaces(true);
      const response = await axios.get(`http://localhost:5000/api/workspaces?userId=${userId}`);
      const workspacesData = Array.isArray(response.data) ? response.data : [];
      // Limit to 5 most recent workspaces for the sidebar
      setWorkspaces(workspacesData.slice(0, 5));
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      setWorkspaces([]);
    } finally {
      setLoadingWorkspaces(false);
    }
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const isActive = (path) => {
    return currentPath === path ? styles.active : "";
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    // Navigate to login page
    navigate('/login');
    // Close sidebar if on mobile
    onClose();
  };

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose}></div>}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.profile}>
          <div className={styles.avatar}>
            {user ? getInitials(user.name) : "U"}
          </div>
          <h3 className={styles.profileName}>
            {user ? user.name : "Guest"}
          </h3>
          <p className={styles.profileRole}>
            {user ? (user.role === 'admin' ? 'Administrator' : 'User') : "Not logged in"}
          </p>
        </div>
        <nav className={styles.nav}>
          <a
            href="/dashboard"
            className={`${styles.navLink} ${isActive("/dashboard")}`}
          >
            {/* <span className={styles.navIcon}>🏠</span> */}
            Home
          </a>
          <a
            href="/workspaces"
            className={`${styles.navLink} ${isActive("/workspaces")}`}
          >
            {/* <span className={styles.navIcon}>📁</span> */}
            Workspaces
          </a>
          <a
            href="/tasksDisplay"
            className={`${styles.navLink} ${isActive("/tasksDisplay")}`}
          >
            {/* <span className={styles.navIcon}>📝</span> */}
            Task Overview
          </a>
          {user?.role === 'admin' && (
            <>
              <a
                href="/tasksCreate"
                className={`${styles.navLink} ${isActive("/tasksCreate")}`}
              >
                {/* <span className={styles.navIcon}>➕</span> */}
                Create Task
              </a>
              <a
                href="/workspace-admin"
                className={`${styles.navLink} ${isActive("/workspace-admin")}`}
              >
                {/* <span className={styles.navIcon}>⚙️</span> */}
                Workspace Admin
              </a>
            </>
          )}
        </nav>
        <div className={styles.recentWorkspaces}>
          <h4 className={styles.sectionTitle}>My Workspaces</h4>
          {loadingWorkspaces ? (
            <p className={styles.loadingText}>Loading...</p>
          ) : workspaces.length > 0 ? (
            <ul className={styles.workspaceList}>
              {workspaces.map((ws) => (
                <li 
                  key={ws._id} 
                  className={styles.workspaceItem}
                  onClick={() => {
                    navigate(`/workspaces/${ws._id}`);
                    onClose();
                  }}
                >
                  <span
                    className={styles.workspaceDot}
                    style={{ backgroundColor: ws.color }}
                  ></span>
                  <div className={styles.workspaceInfo}>
                    <span className={styles.workspaceName}>{ws.name}</span>
                    <span className={styles.workspaceCount}>
                      {ws.members?.length || 0} members
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyText}>No workspaces yet</p>
          )}
        </div>
        <div className={styles.logoutSection}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            {/* <span className={styles.navIcon}>🚪</span> */}
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
