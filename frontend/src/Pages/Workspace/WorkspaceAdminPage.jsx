import React, { useState, useEffect } from "react";
import axios from "axios";
import WorkspaceCard from "./components/WorkspaceCard";
import Sidebar from "../Dashboard/components/Sidebar";
import styles from "./WorkspaceAdminPage.module.css";

export default function WorkspaceAdminPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newWorkspace, setNewWorkspace] = useState({
    name: "",
    color: "#3b82f6",
    description: "",
  });

  useEffect(() => {
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

  const handleCreateWorkspace = async () => {
    if (newWorkspace.name.trim()) {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          alert("Please log in to create workspaces");
          return;
        }

        const user = JSON.parse(storedUser);
        
        const workspaceData = {
          name: newWorkspace.name,
          color: newWorkspace.color,
          createdBy: user.id,
        };

        const response = await axios.post('http://localhost:5000/api/workspaces', workspaceData);
        setWorkspaces([...workspaces, response.data]);
        setNewWorkspace({ name: "", color: "#3b82f6", description: "" });
        setShowCreateForm(false);
      } catch (error) {
        console.error("Error creating workspace:", error);
        alert(error.response?.data?.message || "Failed to create workspace");
      }
    }
  };

  const handleDeleteWorkspace = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/workspaces/${id}`);
      setWorkspaces(workspaces.filter((workspace) => workspace._id !== id));
    } catch (error) {
      console.error("Error deleting workspace:", error);
      alert(error.response?.data?.message || "Failed to delete workspace");
    }
  };

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
          <h1 className={styles.title}>Workspace Admin</h1>
          <p className={styles.subtitle}>
            Create and manage your team workspaces
          </p>
        </header>

        <button
          className={styles.createButton}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancel" : "+ Create Workspace"}
        </button>

        {showCreateForm && (
          <div className={styles.createForm}>
            <input
              type="text"
              placeholder="Workspace name"
              value={newWorkspace.name}
              onChange={(e) =>
                setNewWorkspace({ ...newWorkspace, name: e.target.value })
              }
              className={styles.input}
            />
            <textarea
              placeholder="Description (optional)"
              value={newWorkspace.description}
              onChange={(e) =>
                setNewWorkspace({
                  ...newWorkspace,
                  description: e.target.value,
                })
              }
              className={styles.textarea}
              rows="3"
            />
            <div className={styles.colorPicker}>
              <label className={styles.colorLabel}>Workspace Color:</label>
              <div className={styles.colorOptions}>
                {[
                  "#3b82f6",
                  "#10b981",
                  "#f59e0b",
                  "#ef4444",
                  "#8b5cf6",
                  "#ec4899",
                ].map((color) => (
                  <button
                    key={color}
                    className={`${styles.colorOption} ${
                      newWorkspace.color === color ? styles.colorActive : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewWorkspace({ ...newWorkspace, color })}
                    type="button"
                  />
                ))}
              </div>
            </div>
            <button
              className={styles.submitButton}
              onClick={handleCreateWorkspace}
            >
              Create Workspace
            </button>
          </div>
        )}

        <div className={styles.workspaceGrid}>
          {loading ? (
            <p className={styles.emptyMessage}>Loading workspaces...</p>
          ) : workspaces.length === 0 ? (
            <p className={styles.emptyMessage}>
              No workspaces yet. Create one to get started!
            </p>
          ) : (
            workspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace._id}
                workspace={workspace}
                onDelete={handleDeleteWorkspace}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
