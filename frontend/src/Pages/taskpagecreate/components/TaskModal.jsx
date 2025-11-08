import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./taskModal.module.css";

export default function TaskModal({ taskName, onSubmit, onClose }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (workspace) {
      fetchWorkspaceMembers();
    } else {
      setWorkspaceMembers([]);
      setAssignedTo("");
    }
  }, [workspace]);

  async function fetchWorkspaces() {
    try {
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

  async function fetchWorkspaceMembers() {
    try {
      const selectedWorkspace = workspaces.find(ws => ws.name === workspace);
      if (!selectedWorkspace) return;

      const response = await axios.get(`http://localhost:5000/api/workspaces/${selectedWorkspace._id}`);
      console.log("Workspace details:", response.data);
      
      if (response.data && response.data.members) {
        setWorkspaceMembers(response.data.members);
      }
    } catch (error) {
      console.error("Error fetching workspace members:", error);
      setWorkspaceMembers([]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    // Find the selected workspace to get its color
    const selectedWorkspace = workspaces.find(ws => ws.name === workspace);
    
    onSubmit({
      startDate,
      endDate,
      description,
      category,
      workspace,
      workspaceColor: selectedWorkspace?.color || "#3b82f6",
      assignedTo: assignedTo || null,
    });
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Task Details</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.taskNameDisplay}>
          <span className={styles.label}>Task Name:</span>
          <span className={styles.taskName}>{taskName}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="startDate">
              Start Date
            </label>
            <input
              id="startDate"
              className={styles.input}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="endDate">
              End Date
            </label>
            <input
              id="endDate"
              className={styles.input}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task..."
              rows="4"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="development">Development</option>
              <option value="design">Design</option>
              <option value="testing">Testing</option>
              <option value="documentation">Documentation</option>
              <option value="bug">Bug Fix</option>
              <option value="feature">Feature</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="workspace">
              Workspace
            </label>
            <select
              id="workspace"
              className={styles.select}
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
              disabled={loading}
            >
              <option value="">Select a workspace</option>
              {workspaces.map((ws) => (
                <option key={ws._id} value={ws.name}>
                  {ws.name}
                </option>
              ))}
            </select>
          </div>

          {currentUser?.role === 'admin' && workspace && (
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="assignedTo">
                Assign To (Optional)
              </label>
              <select
                id="assignedTo"
                className={styles.select}
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">No assignment</option>
                {workspaceMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
