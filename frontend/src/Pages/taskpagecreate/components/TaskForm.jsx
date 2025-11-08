import { useState } from "react";
import axios from "axios";
import styles from "./taskForm.module.css";
import TaskModal from "./TaskModal";

export default function TaskForm({ tasks, setTasks, onTaskCreated }) {
  const [taskInput, setTaskInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (taskInput.trim()) {
      setShowModal(true);
    }
  }

  async function handleModalSubmit(taskDetails) {
    try {
      setLoading(true);

      // Get user from localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert("Please log in to create tasks");
        return;
      }

      const user = JSON.parse(storedUser);

      const newTask = {
        name: taskInput,
        description: taskDetails.description || "",
        workspace: taskDetails.workspace || "",
        workspaceColor: taskDetails.workspaceColor || "#3b82f6",
        priority: "Medium",
        deadline: taskDetails.endDate || new Date().toISOString().split('T')[0],
        startDate: taskDetails.startDate || new Date().toISOString().split('T')[0],
        category: taskDetails.category || "",
        userId: user.id,
        assignedTo: taskDetails.assignedTo || null,
      };

      const response = await axios.post('http://localhost:5000/api/tasks', newTask);
      console.log("Task created:", response.data);

      // Refresh tasks list
      if (onTaskCreated) {
        onTaskCreated();
      }

      setTaskInput("");
      setShowModal(false);
    } catch (error) {
      console.error("Error creating task:", error);
      alert(error.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  }

  function handleModalClose() {
    setShowModal(false);
  }

  return (
    <>
      <form className={styles.taskForm} onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <input
            className={styles.taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            value={taskInput}
            placeholder="Enter a new task..."
            type="text"
            autoComplete="off"
          />
          <button className={styles.addButton} type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>
      </form>

      {showModal && (
        <TaskModal
          taskName={taskInput}
          onSubmit={handleModalSubmit}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}
