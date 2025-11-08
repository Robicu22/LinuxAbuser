import Task from "../model/taskModel.js";
import Workspace from "../model/workspaceModel.js";
import User from "../model/userModel.js";
import { createNotification } from "./notificationController.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    console.log("Create task request:", req.body);
    const { name, description, workspace, workspaceColor, priority, deadline, startDate, category, assignedTo } = req.body;
    const userId = req.body.userId; // Will come from authenticated user

    if (!name || !deadline || !userId) {
      return res.status(400).json({ message: "Name, deadline, and userId are required" });
    }

    // If assignedTo is provided, validate that the user is a member of the workspace
    if (assignedTo && workspace) {
      const workspaceDoc = await Workspace.findOne({ name: workspace });
      if (workspaceDoc) {
        const isMember = workspaceDoc.members.includes(assignedTo) || workspaceDoc.createdBy.toString() === assignedTo;
        if (!isMember) {
          return res.status(400).json({ message: "Assigned user must be a member of the workspace" });
        }
      }
    }

    const newTask = new Task({
      name,
      description,
      workspace,
      workspaceColor,
      priority,
      deadline,
      startDate,
      category,
      userId,
      assignedTo: assignedTo || null,
    });

    await newTask.save();
    console.log("Task created successfully:", newTask._id);

    // Create notification for assigned user
    if (assignedTo && assignedTo !== userId) {
      try {
        await createNotification(
          assignedTo,
          `You have been assigned a new task: "${name}"`,
          newTask._id,
          "task_assigned"
        );
      } catch (notifError) {
        console.error("Failed to create notification:", notifError);
        // Don't fail the task creation if notification fails
      }
    }

    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

// Get all tasks for a user
export const getTasks = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Check if user is admin
    const user = await User.findById(userId);
    
    let tasks;
    if (user && user.role === "admin") {
      // Admin sees all tasks
      tasks = await Task.find({})
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Get all workspaces where user is a member
      const userWorkspaces = await Workspace.find({
        members: userId,
      });

      const workspaceNames = userWorkspaces.map((ws) => ws.name);

      // Regular users see:
      // 1. All tasks in their workspaces (regardless of assignment)
      // 2. Tasks assigned specifically to them (even if not in their workspaces)
      tasks = await Task.find({
        $or: [
          { workspace: { $in: workspaceNames } },
          { assignedTo: userId }
        ]
      })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

      console.log(`Found ${tasks.length} tasks for user ${userId} in ${workspaceNames.length} workspaces`);
    }

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

// Get recent tasks (limit to 5)
export const getRecentTasks = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Check if user is admin
    const user = await User.findById(userId);
    
    let tasks;
    if (user && user.role === "admin") {
      // Admin sees all recent tasks
      tasks = await Task.find({})
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .limit(5);
    } else {
      // Get all workspaces where user is a member
      const userWorkspaces = await Workspace.find({
        members: userId,
      });

      const workspaceNames = userWorkspaces.map((ws) => ws.name);

      // Regular users see:
      // 1. Unassigned tasks (assignedTo is null) in their workspaces
      // 2. Tasks assigned specifically to them
      tasks = await Task.find({
        $or: [
          { workspace: { $in: workspaceNames }, assignedTo: null },
          { assignedTo: userId }
        ],
      })
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .limit(5);
    }

    console.log(`Found ${tasks.length} recent tasks for user ${userId}`);

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching recent tasks:", error);
    res.status(500).json({ message: "Error fetching recent tasks", error: error.message });
  }
};

// Get a single task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Error fetching task", error: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { name, description, workspace, workspaceColor, priority, deadline, startDate, completed, category, assignedTo, userId } = req.body;

    // Get the old task to check if assignment changed
    const oldTask = await Task.findById(req.params.id);
    
    if (!oldTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { name, description, workspace, workspaceColor, priority, deadline, startDate, completed, category, assignedTo },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("Task updated successfully:", task._id);

    // Create notification if task was newly assigned or reassigned to a different user
    const oldAssignedTo = oldTask.assignedTo?.toString();
    const newAssignedTo = assignedTo?.toString();
    
    if (newAssignedTo && newAssignedTo !== oldAssignedTo && newAssignedTo !== userId) {
      try {
        const message = oldAssignedTo 
          ? `Task "${name}" has been reassigned to you`
          : `You have been assigned to task: "${name}"`;
        
        await createNotification(
          newAssignedTo,
          message,
          task._id,
          "task_updated"
        );
      } catch (notifError) {
        console.error("Failed to create notification:", notifError);
        // Don't fail the task update if notification fails
      }
    }

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

// Accept a task (for regular users)
export const acceptTask = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if task is already assigned
    if (task.assignedTo) {
      return res.status(400).json({ message: "Task is already assigned" });
    }

    // Verify user is a member of the workspace
    const workspace = await Workspace.findOne({ name: task.workspace });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isMember = workspace.members.includes(userId);
    if (!isMember) {
      return res.status(403).json({ message: "You must be a member of this workspace to accept tasks" });
    }

    // Assign task to user
    task.assignedTo = userId;
    await task.save();

    console.log("Task accepted by user:", userId);

    res.status(200).json({
      message: "Task accepted successfully",
      task,
    });
  } catch (error) {
    console.error("Error accepting task:", error);
    res.status(500).json({ message: "Error accepting task", error: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("Task deleted successfully:", req.params.id);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};

// Toggle task completion
export const toggleTaskCompletion = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user is admin
    const user = await User.findById(userId);
    const isAdmin = user && user.role === "admin";

    // Only allow completion if:
    // 1. User is admin, OR
    // 2. Task is assigned to this user
    if (!isAdmin && (!task.assignedTo || task.assignedTo.toString() !== userId)) {
      return res.status(403).json({ message: "You can only complete tasks assigned to you" });
    }

    task.completed = !task.completed;
    await task.save();

    console.log("Task completion toggled:", task._id, "completed:", task.completed);

    res.status(200).json({
      message: "Task completion toggled",
      task,
    });
  } catch (error) {
    console.error("Error toggling task completion:", error);
    res.status(500).json({ message: "Error toggling task completion", error: error.message });
  }
};

// Get all tasks in a workspace (for member task counting)
export const getWorkspaceTasks = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Get workspace details
    const workspace = await Workspace.findById(workspaceId);
    
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if user is admin or member of this workspace
    const user = await User.findById(userId);
    const isAdmin = user && user.role === "admin";
    const isMember = workspace.members.includes(userId);

    if (!isAdmin && !isMember) {
      return res.status(403).json({ message: "You must be a member of this workspace to view its tasks" });
    }

    // Get all tasks in this workspace
    const tasks = await Task.find({ workspace: workspace.name })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    console.log(`Found ${tasks.length} tasks in workspace ${workspace.name}`);

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching workspace tasks:", error);
    res.status(500).json({ message: "Error fetching workspace tasks", error: error.message });
  }
};
