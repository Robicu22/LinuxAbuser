import { useState, useEffect } from "react";
import axios from "axios";
import Task from "./components/Task";
import Sidebar from "../Dashboard/components/Sidebar";
import EditTaskModal from "./components/EditTaskModal";
import styles from "./taskPageDisplay.module.css";

export default function TaskPageDisplay() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [filterTab, setFilterTab] = useState("all"); // "all", "unassigned", "assigned"
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError("Please log in to view tasks");
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      const response = await axios.get(`http://localhost:5000/api/tasks?userId=${user.id}`);
      
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
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert("Please log in to update tasks");
        return;
      }

      const user = JSON.parse(storedUser);
      const response = await axios.patch(`http://localhost:5000/api/tasks/${id}/toggle`, {
        userId: user.id
      });
      console.log("Task toggled:", response.data);
      
      setTasks(
        tasks.map((task) =>
          task._id === id ? response.data.task : task
        )
      );
    } catch (error) {
      console.error("Error toggling task:", error);
      const errorMessage = error.response?.data?.message || "Failed to update task";
      alert(errorMessage);
    }
  }

  async function handleDeleteTask(id) {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert("Please log in to delete tasks");
        return;
      }

      const user = JSON.parse(storedUser);
      
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        data: { userId: user.id }
      });
      console.log("Task deleted:", id);
      
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete task";
      alert(errorMessage);
    }
  }

  async function handleAcceptTask(taskId) {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert("Please log in to accept tasks");
        return;
      }

      const user = JSON.parse(storedUser);

      await axios.patch(`http://localhost:5000/api/tasks/${taskId}/accept`, {
        userId: user.id,
      });

      alert("Task accepted successfully!");
      fetchTasks(); // Refresh tasks list
    } catch (error) {
      console.error("Error accepting task:", error);
      alert(error.response?.data?.message || "Failed to accept task");
    }
  }

  async function handleEditTask(taskData) {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert("Please log in to edit tasks");
        return;
      }

      const user = JSON.parse(storedUser);
      
      if (user.role !== 'admin') {
        alert("Only admins can edit tasks");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/tasks/${editingTask._id}`,
        {
          ...taskData,
          userId: user.id
        }
      );
      
      console.log("Task updated:", response.data);
      
      // Update the task in the local state
      setTasks(
        tasks.map((task) =>
          task._id === editingTask._id ? response.data.task : task
        )
      );
      
      setEditingTask(null);
      alert("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      const errorMessage = error.response?.data?.message || "Failed to update task";
      alert(errorMessage);
    }
  }

  function openEditModal(task) {
    setEditingTask(task);
  }

  function closeEditModal() {
    setEditingTask(null);
  }

  // Filter tasks based on selected tab
  const getFilteredTasks = () => {
    if (!currentUser) return tasks;

    switch (filterTab) {
      case "unassigned":
        return tasks.filter(task => !task.assignedTo);
      case "assigned":
        return tasks.filter(task => 
          task.assignedTo && (task.assignedTo._id === currentUser.id || task.assignedTo === currentUser.id)
        );
      case "all":
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

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
        <h1 className={styles.title}>Task Overview</h1>
        
        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          <button
            className={`${styles.filterTab} ${filterTab === "all" ? styles.activeTab : ""}`}
            onClick={() => setFilterTab("all")}
          >
            All Tasks
          </button>
          <button
            className={`${styles.filterTab} ${filterTab === "unassigned" ? styles.activeTab : ""}`}
            onClick={() => setFilterTab("unassigned")}
          >
            Unassigned
          </button>
          <button
            className={`${styles.filterTab} ${filterTab === "assigned" ? styles.activeTab : ""}`}
            onClick={() => setFilterTab("assigned")}
          >
            My Tasks
          </button>
        </div>

        {loading ? (
          <p className={styles.loadingMessage}>Loading tasks...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : (
          <div className={styles.taskList}>
            {filteredTasks.length === 0 ? (
              <p className={styles.emptyMessage}>
                {filterTab === "unassigned" 
                  ? "No unassigned tasks available." 
                  : filterTab === "assigned" 
                  ? "No tasks assigned to you." 
                  : "No tasks to display."}
              </p>
            ) : (
              filteredTasks.map((task) => (
                <Task
                  key={task._id}
                  task={task}
                  currentUser={currentUser}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                  onAccept={filterTab === "unassigned" && currentUser?.role !== "admin" ? handleAcceptTask : null}
                  onEdit={currentUser?.role === "admin" ? openEditModal : null}
                />
              ))
            )}
          </div>
        )}
      </div>
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSubmit={handleEditTask}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
}
