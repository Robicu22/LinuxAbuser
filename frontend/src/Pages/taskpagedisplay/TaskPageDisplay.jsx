import { useState } from "react";
import Task from "./components/Task";
import Sidebar from "../Dashboard/components/Sidebar";
import styles from "./taskPageDisplay.module.css";

export default function TaskPageDisplay() {
  // Sample tasks for display purposes
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Implement user authentication",
      completed: false,
      startDate: "2025-11-01",
      endDate: "2025-11-15",
      description: "Add JWT-based authentication to the backend API",
      category: "development",
      workspace: "backend",
    },
    {
      id: 2,
      name: "Design landing page",
      completed: true,
      startDate: "2025-10-20",
      endDate: "2025-10-30",
      description: "Create mockups for the new landing page",
      category: "design",
      workspace: "frontend",
    },
    {
      id: 3,
      name: "Write API documentation",
      completed: false,
      startDate: "2025-11-05",
      endDate: "2025-11-12",
      description: "Document all REST API endpoints",
      category: "documentation",
      workspace: "backend",
    },
  ]);

  function handleToggleTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function handleDeleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  return (
    <div className={styles.pageWrapper}>
      <Sidebar />
      <div className={styles.pageContainer}>
        <h1 className={styles.title}>Task Overview</h1>
        <div className={styles.taskList}>
          {tasks.length === 0 ? (
            <p className={styles.emptyMessage}>No tasks to display.</p>
          ) : (
            tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
