import React, { useState } from "react";
import MemberItem from "./MemberItem";
import styles from "./MembersList.module.css";

export default function MembersList({ members, workspaceColor }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterRole, setFilterRole] = useState("All");

  // Filter members
  let filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "All" || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Sort members
  filteredMembers = [...filteredMembers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "role":
        return a.role.localeCompare(b.role);
      case "tasks":
        return b.tasksCount - a.tasksCount;
      default:
        return 0;
    }
  });

  return (
    <div className={styles.membersList}>
      <h2 className={styles.title}>Members ({filteredMembers.length})</h2>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search members..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className={styles.filters}>
          <select
            className={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by: Name</option>
            <option value="role">Sort by: Role</option>
            <option value="tasks">Sort by: Tasks Count</option>
          </select>

          <select
            className={styles.select}
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">Role: All</option>
            <option value="Coordinator">Coordinator</option>
            <option value="Member">Member</option>
          </select>
        </div>
      </div>

      <div className={styles.membersContainer}>
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <MemberItem
              key={member.id}
              member={member}
              workspaceColor={workspaceColor}
            />
          ))
        ) : (
          <p className={styles.emptyMessage}>No members found</p>
        )}
      </div>
    </div>
  );
}
