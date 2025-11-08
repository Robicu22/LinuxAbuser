import express from "express";
import {
  createTask,
  getTasks,
  getRecentTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  acceptTask,
  getWorkspaceTasks,
} from "../controller/taskController.js";
import { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Task routes - only admin can create, update, delete tasks
router.post("/tasks", isAdmin, createTask);
router.get("/tasks", getTasks);
router.get("/tasks/recent", getRecentTasks);
router.get("/tasks/workspace/:workspaceId", getWorkspaceTasks); // Get all tasks in a workspace
router.get("/tasks/:id", getTaskById);
router.put("/tasks/:id", isAdmin, updateTask);
router.patch("/tasks/:id/accept", acceptTask); // Regular users can accept tasks
router.delete("/tasks/:id", isAdmin, deleteTask);
router.patch("/tasks/:id/toggle", toggleTaskCompletion);

export default router;
