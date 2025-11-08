import { useState } from "react";
import styles from "./taskModal.module.css";

export default function TaskModal({ taskName, onSubmit, onClose }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [workspace, setWorkspace] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      startDate,
      endDate,
      description,
      category,
      workspace,
    });
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Task Details</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.taskNameDisplay}>
          <span className={styles.label}>Task Name:</span>
          <span className={styles.taskName}>{taskName}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="startDate">
              Start Date
            </label>
            <input
              id="startDate"
              className={styles.input}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="endDate">
              End Date
            </label>
            <input
              id="endDate"
              className={styles.input}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task..."
              rows="4"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="development">Development</option>
              <option value="design">Design</option>
              <option value="testing">Testing</option>
              <option value="documentation">Documentation</option>
              <option value="bug">Bug Fix</option>
              <option value="feature">Feature</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="workspace">
              Workspace
            </label>
            <select
              id="workspace"
              className={styles.select}
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
            >
              <option value="">Select a workspace</option>
              <option value="backend">Backend</option>
              <option value="frontend">Frontend</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
