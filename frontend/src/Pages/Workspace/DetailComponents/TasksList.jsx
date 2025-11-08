import React, { useState } from "react";
import TaskItem from "./TaskItem";
import styles from "./TasksList.module.css";

export default function TasksList({ tasks, workspaceColor, currentUser, onAcceptTask, onToggleTask, onDeleteTask, filterTab }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  console.log("TasksList received tasks:", tasks);
  console.log("onAcceptTask function:", onAcceptTask);

  // Ensure tasks is an array
  const taskArray = Array.isArray(tasks) ? tasks : [];

  // Filter tasks
  let filteredTasks = taskArray.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      filterStatus === "All" || 
      (filterStatus === "Completed" ? task.completed : !task.completed);
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
        const priorityOrder = { Urgent: 1, High: 2, Medium: 3, Low: 4 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case "status":
        return (a.completed ? 1 : 0) - (b.completed ? 1 : 0);
      case "dueDate":
      default:
        return new Date(a.deadline) - new Date(b.deadline);
    }
  });

  // Get appropriate title based on filter tab
  const getTitle = () => {
    switch (filterTab) {
      case "unassigned":
        return `Unassigned Tasks (${filteredTasks.length})`;
      case "assigned":
        return `My Tasks (${filteredTasks.length})`;
      case "all":
      default:
        return `All Tasks (${filteredTasks.length})`;
    }
  };

  // Get appropriate empty message based on filter tab
  const getEmptyMessage = () => {
    if (taskArray.length === 0) {
      switch (filterTab) {
        case "unassigned":
          return "No unassigned tasks in this workspace";
        case "assigned":
          return "No tasks assigned to you in this workspace";
        case "all":
        default:
          return "No tasks in this workspace";
      }
    }
    return "No tasks match your filters";
  };

  return (
    <div className={styles.tasksList}>
      <h2 className={styles.title}>{getTitle()}</h2>

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
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            className={styles.select}
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All">Priority: All</option>
            <option value="Urgent">Urgent</option>
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
              key={task._id}
              task={task}
              workspaceColor={workspaceColor}
              currentUser={currentUser}
              onAcceptTask={onAcceptTask}
              onToggleTask={onToggleTask}
              onDeleteTask={onDeleteTask}
            />
          ))
        ) : (
          <p className={styles.emptyMessage}>{getEmptyMessage()}</p>
        )}
      </div>
    </div>
  );
}
