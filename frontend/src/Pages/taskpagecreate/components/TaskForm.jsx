import { useState } from "react";
import styles from "./taskForm.module.css";
import TaskModal from "./TaskModal";

export default function TaskForm({ tasks, setTasks }) {
  const [taskInput, setTaskInput] = useState("");
  const [showModal, setShowModal] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (taskInput.trim()) {
      setShowModal(true);
    }
  }

  function handleModalSubmit(taskDetails) {
    const newTask = {
      id: Date.now(),
      name: taskInput,
      completed: false,
      ...taskDetails,
    };
    setTasks([...tasks, newTask]);
    setTaskInput("");
    setShowModal(false);
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
          <button className={styles.addButton} type="submit">
            Add Task
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
