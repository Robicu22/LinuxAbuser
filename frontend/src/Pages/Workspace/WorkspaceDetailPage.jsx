

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TasksList from "./DetailComponents/TasksList";
import MembersList from "./DetailComponents/MembersList";
import Sidebar from "../Dashboard/components/Sidebar";
import styles from "./WorkspaceDetailPage.module.css";

export default function WorkspaceDetailPage() {
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [workspace, setWorkspace] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchWorkspaceDetails();
    fetchWorkspaceTasks();
  }, [id]);

  async function fetchWorkspaceDetails() {
    try {
      const response = await axios.get(`http://localhost:5000/api/workspaces/${id}`);
      setWorkspace(response.data);
    } catch (error) {
      console.error("Error fetching workspace:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchWorkspaceTasks() {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;

      const userData = JSON.parse(storedUser);
      const response = await axios.get(`http://localhost:5000/api/tasks?userId=${userData.id}`);
      const tasksData = response.data.tasks || response.data;
      
      // Filter tasks for this workspace
      if (workspace) {
        const workspaceTasks = tasksData.filter(task => task.workspace === workspace.name);
        setTasks(workspaceTasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  async function handleAddMember() {
    if (!newMemberEmail.trim()) {
      alert("Please enter an email address");
      return;
    }

    try {
      // First, find user by email
      const userResponse = await axios.get(`http://localhost:5000/api/users?email=${newMemberEmail}`);
      
      if (!userResponse.data) {
        alert("User not found with that email");
        return;
      }

      const newMember = userResponse.data;

      // Add member to workspace
      await axios.post(`http://localhost:5000/api/workspaces/${id}/members`, {
        userId: newMember._id,
        createdBy: user.id, // Admin user ID for auth
      });

      alert(`${newMember.name} added to workspace successfully!`);
      setNewMemberEmail("");
      setShowAddMember(false);
      fetchWorkspaceDetails(); // Refresh workspace data
    } catch (error) {
      console.error("Error adding member:", error);
      alert(error.response?.data?.message || "Failed to add member");
    }
  }

  async function handleRemoveMember(memberId) {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/workspaces/${id}/members`, {
        data: { userId: memberId, createdBy: user.id },
      });

      alert("Member removed successfully!");
      fetchWorkspaceDetails(); // Refresh workspace data
    } catch (error) {
      console.error("Error removing member:", error);
      alert(error.response?.data?.message || "Failed to remove member");
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading workspace...</div>;
  }

  if (!workspace) {
    return (
      <div className={styles.errorPage}>
        <h1>Workspace not found</h1>
        <a href="/workspaces">Back to Workspaces</a>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      <button
        className={styles.menuButton}
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <div
              className={styles.colorDot}
              style={{ backgroundColor: workspace.color }}
            ></div>
            <h1 className={styles.workspaceName}>{workspace.name}</h1>
          </div>
          <a href="/workspaces" className={styles.backButton}>
            ← Back to Workspaces
          </a>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Members</h2>
            {user?.role === 'admin' && (
              <button 
                onClick={() => setShowAddMember(!showAddMember)}
                className={styles.addButton}
              >
                {showAddMember ? 'Cancel' : '+ Add Member'}
              </button>
            )}
          </div>
          
          {showAddMember && user?.role === 'admin' && (
            <div className={styles.addMemberForm}>
              <input
                type="email"
                placeholder="Enter user email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className={styles.emailInput}
              />
              <button onClick={handleAddMember} className={styles.submitButton}>
                Add
              </button>
            </div>
          )}
          
          <MembersList
            members={workspace.members}
            workspaceColor={workspace.color}
            onRemoveMember={user?.role === 'admin' ? handleRemoveMember : null}
            creatorId={workspace.createdBy?._id}
          />
        </div>
        <div className={styles.divider}></div>
        <div className={styles.section}>
          <TasksList tasks={tasks} workspaceColor={workspace.color} />
        </div>
      </div>
    </div>
  );
}
