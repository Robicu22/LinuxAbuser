import express from "express";
import {
  createTask,
  getTasks,
  getRecentTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
} from "../controller/taskController.js";
import { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Task routes - only admin can create, update, delete tasks
router.post("/tasks", isAdmin, createTask);
router.get("/tasks", getTasks);
router.get("/tasks/recent", getRecentTasks);
router.get("/tasks/:id", getTaskById);
router.put("/tasks/:id", isAdmin, updateTask);
router.delete("/tasks/:id", isAdmin, deleteTask);
router.patch("/tasks/:id/toggle", toggleTaskCompletion);

export default router;
