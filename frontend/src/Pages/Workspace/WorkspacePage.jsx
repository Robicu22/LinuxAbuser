import React from "react";
import WorkspaceCard from "./components/WorkspaceCard";
import styles from "./WorkspacePage.module.css";

// Example workspace data - will be replaced with database later
// Using same workspace names and colors as in Dashboard
const workspaces = [
  {
    id: 1,
    name: "Workspace Example 1",
    color: "#3b82f6",
    coordinators: [
      { name: "John Doe", initials: "JD" },
      { name: "Sarah Smith", initials: "SS" },
    ],
    memberCount: 12,
    description:
      "Main development workspace for frontend and backend integration projects.",
  },
  {
    id: 2,
    name: "Workspace Example 2",
    color: "#10b981",
    coordinators: [{ name: "Michael Brown", initials: "MB" }],
    memberCount: 8,
    description:
      "Design and UX team workspace for all creative projects and prototypes.",
  },
  {
    id: 3,
    name: "Workspace Example 3",
    color: "#f59e0b",
    coordinators: [
      { name: "Emily Davis", initials: "ED" },
      { name: "David Wilson", initials: "DW" },
    ],
    memberCount: 5,
    description:
      "Quality assurance and testing workspace for product validation.",
  },
  {
    id: 4,
    name: "Workspace Example 4",
    color: "#ef4444",
    coordinators: [{ name: "Lisa Anderson", initials: "LA" }],
    memberCount: 3,
    description:
      "Security and infrastructure team workspace for system administration.",
  },
  {
    id: 5,
    name: "Workspace Example 5",
    color: "#8b5cf6",
    coordinators: [
      { name: "Robert Taylor", initials: "RT" },
      { name: "Anna Martinez", initials: "AM" },
      { name: "Chris Lee", initials: "CL" },
    ],
    memberCount: 15,
    description:
      "Marketing and content creation workspace for campaigns and strategies.",
  },
];

export default function WorkspacePage() {
  return (
    <div className={styles.workspacePage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>All Workspaces</h1>
          <p className={styles.subtitle}>
            Browse and manage your team workspaces
          </p>
        </header>

        <div className={styles.workspaceGrid}>
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      </div>
    </div>
  );
}
