import { useState } from "react";
import TaskForm from "./components/TaskForm";
import Task from "./components/Task";
import styles from "./taskPageCreate.module.css";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);

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
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>My Tasks</h1>
      <TaskForm tasks={tasks} setTasks={setTasks} />
      <div className={styles.taskList}>
        {tasks.length === 0 ? (
          <p className={styles.emptyMessage}>No tasks yet. Add one above!</p>
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
  );
}
