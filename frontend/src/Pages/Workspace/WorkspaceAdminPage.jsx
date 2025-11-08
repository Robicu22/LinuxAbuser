import React, { useState } from "react";
import WorkspaceCard from "./components/WorkspaceCard";
import Sidebar from "../Dashboard/components/Sidebar";
import styles from "./WorkspaceAdminPage.module.css";

export default function WorkspaceAdminPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    name: "",
    color: "#3b82f6",
    description: "",
  });

  const handleCreateWorkspace = () => {
    if (newWorkspace.name.trim()) {
      const workspace = {
        id: Date.now(),
        name: newWorkspace.name,
        color: newWorkspace.color,
        coordinators: [{ name: "You", initials: "Y" }],
        memberCount: 1,
        description: newWorkspace.description,
      };
      setWorkspaces([...workspaces, workspace]);
      setNewWorkspace({ name: "", color: "#3b82f6", description: "" });
      setShowCreateForm(false);
    }
  };

  const handleDeleteWorkspace = (id) => {
    setWorkspaces(workspaces.filter((workspace) => workspace.id !== id));
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
          {workspaces.length === 0 ? (
            <p className={styles.emptyMessage}>
              No workspaces yet. Create one to get started!
            </p>
          ) : (
            workspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
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
