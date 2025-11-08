

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
  const [allWorkspaceTasks, setAllWorkspaceTasks] = useState([]); // For calculating member task counts
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [taskFilterTab, setTaskFilterTab] = useState("all"); // "all", "unassigned", "assigned"

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchWorkspaceDetails();
  }, [id]);

  useEffect(() => {
    // Fetch tasks when workspace is loaded
    if (workspace) {
      fetchWorkspaceTasks();
    }
  }, [workspace]);

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

      // Fetch ALL tasks in this workspace
      const workspaceTasksResponse = await axios.get(
        `http://localhost:5000/api/tasks/workspace/${id}?userId=${userData.id}`
      );
      const allTasksData = workspaceTasksResponse.data.tasks || workspaceTasksResponse.data;
      
      console.log("All workspace tasks fetched:", allTasksData);
      setAllWorkspaceTasks(allTasksData);
      setTasks(allTasksData); // Now we store all tasks and filter in the component
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  async function handleAcceptTask(taskId) {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert("Please log in to accept tasks");
        return;
      }

      const userData = JSON.parse(storedUser);

      await axios.patch(`http://localhost:5000/api/tasks/${taskId}/accept`, {
        userId: userData.id,
      });

      alert("Task accepted successfully!");
      fetchWorkspaceTasks(); // Refresh tasks list
    } catch (error) {
      console.error("Error accepting task:", error);
      alert(error.response?.data?.message || "Failed to accept task");
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

  async function handleToggleTask(taskId) {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert("Please log in to update tasks");
        return;
      }

      const userData = JSON.parse(storedUser);
      const response = await axios.patch(`http://localhost:5000/api/tasks/${taskId}/toggle`, {
        userId: userData.id
      });
      
      // Update both tasks arrays
      setTasks(tasks.map(task => task._id === taskId ? response.data.task : task));
      setAllWorkspaceTasks(allWorkspaceTasks.map(task => task._id === taskId ? response.data.task : task));
    } catch (error) {
      console.error("Error toggling task:", error);
      const errorMessage = error.response?.data?.message || "Failed to update task";
      alert(errorMessage);
    }
  }

  async function handleDeleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert("Please log in to delete tasks");
        return;
      }

      const userData = JSON.parse(storedUser);
      
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        data: { userId: userData.id }
      });
      
      // Update both tasks arrays
      setTasks(tasks.filter(task => task._id !== taskId));
      setAllWorkspaceTasks(allWorkspaceTasks.filter(task => task._id !== taskId));
      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete task";
      alert(errorMessage);
    }
  }

  // Filter tasks based on selected tab
  const getFilteredTasks = () => {
    if (!user) return tasks;

    switch (taskFilterTab) {
      case "unassigned":
        return tasks.filter(task => !task.assignedTo);
      case "assigned":
        return tasks.filter(task => 
          task.assignedTo && (task.assignedTo._id === user.id || task.assignedTo === user.id)
        );
      case "all":
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

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
            workspaceTasks={allWorkspaceTasks}
            onRemoveMember={user?.role === 'admin' ? handleRemoveMember : null}
            creatorId={workspace.createdBy?._id}
          />
        </div>
        <div className={styles.divider}></div>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Tasks</h2>
          </div>
          
          {/* Filter Tabs */}
          <div className={styles.filterTabs}>
            <button
              className={`${styles.filterTab} ${taskFilterTab === "all" ? styles.activeTab : ""}`}
              onClick={() => setTaskFilterTab("all")}
            >
              All Tasks
            </button>
            <button
              className={`${styles.filterTab} ${taskFilterTab === "unassigned" ? styles.activeTab : ""}`}
              onClick={() => setTaskFilterTab("unassigned")}
            >
              Unassigned
            </button>
            <button
              className={`${styles.filterTab} ${taskFilterTab === "assigned" ? styles.activeTab : ""}`}
              onClick={() => setTaskFilterTab("assigned")}
            >
              My Tasks
            </button>
          </div>

          <TasksList 
            tasks={filteredTasks} 
            workspaceColor={workspace.color}
            currentUser={user}
            onAcceptTask={taskFilterTab === "unassigned" && user?.role !== 'admin' ? handleAcceptTask : null}
            onToggleTask={handleToggleTask}
            onDeleteTask={null}
            filterTab={taskFilterTab}
          />
        </div>
      </div>
    </div>
  );
}
