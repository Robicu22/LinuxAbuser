import React, { useState } from "react";
import TaskItem from "./TaskItem";
import styles from "./TasksList.module.css";

export default function TasksList({ tasks, workspaceColor }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  // Filter tasks
  let filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || task.status === filterStatus;
    const matchesPriority =
      filterPriority === "All" || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort tasks
  filteredTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "priority":
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case "status":
        return a.status.localeCompare(b.status);
      case "dueDate":
      default:
        return new Date(a.dueDate) - new Date(b.dueDate);
    }
  });

  return (
    <div className={styles.tasksList}>
      <h2 className={styles.title}>Tasks ({filteredTasks.length})</h2>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search tasks..."
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
            <option value="dueDate">Sort by: Due Date</option>
            <option value="name">Sort by: Name</option>
            <option value="priority">Sort by: Priority</option>
            <option value="status">Sort by: Status</option>
          </select>

          <select
            className={styles.select}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">Status: All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            className={styles.select}
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All">Priority: All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div className={styles.tasksContainer}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              workspaceColor={workspaceColor}
            />
          ))
        ) : (
          <p className={styles.emptyMessage}>No tasks found</p>
        )}
      </div>
    </div>
  );
}
