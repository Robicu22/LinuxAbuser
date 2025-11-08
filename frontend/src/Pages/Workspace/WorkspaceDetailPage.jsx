import React, { useState } from "react";
import { useParams } from "react-router-dom";
import TasksList from "./DetailComponents/TasksList";
import MembersList from "./DetailComponents/MembersList";
import Sidebar from "../Dashboard/components/Sidebar";
import styles from "./WorkspaceDetailPage.module.css";

// Example data - will be replaced with database later
const workspaceData = {
  "workspace-example-1": {
    name: "Workspace Example 1",
    color: "#3b82f6",
    tasks: [
      {
        id: 1,
        name: "Fix login bug",
        priority: "High",
        status: "In Progress",
        assignee: "John Doe",
        dueDate: "2025-11-15",
      },
      {
        id: 2,
        name: "Update documentation",
        priority: "Medium",
        status: "To Do",
        assignee: "Sarah Smith",
        dueDate: "2025-11-20",
      },
      {
        id: 3,
        name: "Code review",
        priority: "High",
        status: "Done",
        assignee: "John Doe",
        dueDate: "2025-11-10",
      },
      {
        id: 4,
        name: "Database optimization",
        priority: "Low",
        status: "In Progress",
        assignee: "Sarah Smith",
        dueDate: "2025-11-25",
      },
      {
        id: 5,
        name: "API integration",
        priority: "High",
        status: "To Do",
        assignee: "John Doe",
        dueDate: "2025-11-18",
      },
    ],
    members: [
      {
        id: 1,
        name: "John Doe",
        initials: "JD",
        role: "Coordinator",
        email: "john.doe@example.com",
        tasksCount: 7,
      },
      {
        id: 2,
        name: "Sarah Smith",
        initials: "SS",
        role: "Coordinator",
        email: "sarah.smith@example.com",
        tasksCount: 5,
      },
      {
        id: 3,
        name: "Mike Johnson",
        initials: "MJ",
        role: "Member",
        email: "mike.j@example.com",
        tasksCount: 3,
      },
      {
        id: 4,
        name: "Emily Brown",
        initials: "EB",
        role: "Member",
        email: "emily.b@example.com",
        tasksCount: 4,
      },
      {
        id: 5,
        name: "David Lee",
        initials: "DL",
        role: "Member",
        email: "david.lee@example.com",
        tasksCount: 2,
      },
    ],
  },
  "workspace-example-2": {
    name: "Workspace Example 2",
    color: "#10b981",
    tasks: [
      {
        id: 1,
        name: "Design mockups",
        priority: "High",
        status: "In Progress",
        assignee: "Michael Brown",
        dueDate: "2025-11-12",
      },
      {
        id: 2,
        name: "User research",
        priority: "Medium",
        status: "Done",
        assignee: "Michael Brown",
        dueDate: "2025-11-08",
      },
    ],
    members: [
      {
        id: 1,
        name: "Michael Brown",
        initials: "MB",
        role: "Coordinator",
        email: "michael.b@example.com",
        tasksCount: 8,
      },
      {
        id: 2,
        name: "Anna Wilson",
        initials: "AW",
        role: "Member",
        email: "anna.w@example.com",
        tasksCount: 4,
      },
    ],
  },
  "workspace-example-3": {
    name: "Workspace Example 3",
    color: "#f59e0b",
    tasks: [
      {
        id: 1,
        name: "Test automation",
        priority: "High",
        status: "To Do",
        assignee: "Emily Davis",
        dueDate: "2025-11-16",
      },
      {
        id: 2,
        name: "Bug tracking",
        priority: "Medium",
        status: "In Progress",
        assignee: "David Wilson",
        dueDate: "2025-11-13",
      },
    ],
    members: [
      {
        id: 1,
        name: "Emily Davis",
        initials: "ED",
        role: "Coordinator",
        email: "emily.d@example.com",
        tasksCount: 5,
      },
      {
        id: 2,
        name: "David Wilson",
        initials: "DW",
        role: "Coordinator",
        email: "david.w@example.com",
        tasksCount: 3,
      },
    ],
  },
  "workspace-example-4": {
    name: "Workspace Example 4",
    color: "#ef4444",
    tasks: [
      {
        id: 1,
        name: "Security audit",
        priority: "High",
        status: "In Progress",
        assignee: "Lisa Anderson",
        dueDate: "2025-11-14",
      },
    ],
    members: [
      {
        id: 1,
        name: "Lisa Anderson",
        initials: "LA",
        role: "Coordinator",
        email: "lisa.a@example.com",
        tasksCount: 3,
      },
    ],
  },
  "workspace-example-5": {
    name: "Workspace Example 5",
    color: "#8b5cf6",
    tasks: [
      {
        id: 1,
        name: "Campaign strategy",
        priority: "High",
        status: "To Do",
        assignee: "Robert Taylor",
        dueDate: "2025-11-17",
      },
      {
        id: 2,
        name: "Content creation",
        priority: "Medium",
        status: "In Progress",
        assignee: "Anna Martinez",
        dueDate: "2025-11-19",
      },
    ],
    members: [
      {
        id: 1,
        name: "Robert Taylor",
        initials: "RT",
        role: "Coordinator",
        email: "robert.t@example.com",
        tasksCount: 6,
      },
      {
        id: 2,
        name: "Anna Martinez",
        initials: "AM",
        role: "Coordinator",
        email: "anna.m@example.com",
        tasksCount: 5,
      },
      {
        id: 3,
        name: "Chris Lee",
        initials: "CL",
        role: "Coordinator",
        email: "chris.l@example.com",
        tasksCount: 4,
      },
    ],
  },
};

export default function WorkspaceDetailPage() {
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const workspace = workspaceData[id];

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
          <MembersList
            members={workspace.members}
            workspaceColor={workspace.color}
          />
        </div>
        <div className={styles.divider}></div>
        <div className={styles.section}>
          <TasksList tasks={workspace.tasks} workspaceColor={workspace.color} />
        </div>
      </div>
    </div>
  );
}
