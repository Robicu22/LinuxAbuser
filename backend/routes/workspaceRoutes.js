import express from "express";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember,
} from "../controller/workspaceController.js";
import { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new workspace - admin only
router.post("/workspaces", isAdmin, createWorkspace);

// Get all workspaces for a user
router.get("/workspaces", getWorkspaces);

// Get workspace by ID
router.get("/workspaces/:id", getWorkspaceById);

// Update workspace - admin only
router.put("/workspaces/:id", isAdmin, updateWorkspace);

// Delete workspace - admin only
router.delete("/workspaces/:id", isAdmin, deleteWorkspace);

// Add member to workspace - admin only
router.post("/workspaces/:id/members", isAdmin, addMember);

// Remove member from workspace - admin only
router.delete("/workspaces/:id/members", isAdmin, removeMember);

export default router;
