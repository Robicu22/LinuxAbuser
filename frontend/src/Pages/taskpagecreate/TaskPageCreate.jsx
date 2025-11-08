import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../config/api";
import TaskForm from "./components/TaskForm";
import Task from "./components/Task";
import Sidebar from "../Dashboard/components/Sidebar";
import styles from "./taskPageCreate.module.css";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError("Please log in to view tasks");
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      const response = await axios.get(`${API_URL}/tasks?userId=${user.id}`);
      
      console.log("Tasks fetched:", response.data);
      const tasksData = response.data.tasks || response.data;
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  async function handleToggleTask(id) {
    try {
      const response = await axios.patch(`${API_URL}/tasks/${id}/toggle`);
      console.log("Task toggled:", response.data);
      
      // Update local state
      setTasks(
        tasks.map((task) =>
          task._id === id ? response.data.task : task
        )
      );
    } catch (error) {
      console.error("Error toggling task:", error);
      alert("Failed to update task");
    }
  }

  async function handleDeleteTask(id) {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      console.log("Task deleted:", id);
      
      // Update local state
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <button
        className={styles.menuButton}
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={styles.pageContainer}>
        <h1 className={styles.title}>Tasks</h1>
        <TaskForm tasks={tasks} setTasks={setTasks} onTaskCreated={fetchTasks} />
        {loading ? (
          <p className={styles.loadingMessage}>Loading tasks...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : (
          <div className={styles.taskList}>
            {tasks.length === 0 ? (
              <p className={styles.emptyMessage}>No tasks yet. Add one above!</p>
            ) : (
              tasks.map((task) => (
                <Task
                  key={task._id}
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
