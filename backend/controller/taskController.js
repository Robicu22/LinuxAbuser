import Task from "../model/taskModel.js";
import Workspace from "../model/workspaceModel.js";

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

    // Get all workspaces where user is a member or creator
    const userWorkspaces = await Workspace.find({
      $or: [{ createdBy: userId }, { members: userId }],
    });

    const workspaceNames = userWorkspaces.map((ws) => ws.name);

    // Get tasks from those workspaces OR tasks assigned to this user
    const tasks = await Task.find({
      $or: [
        { workspace: { $in: workspaceNames } },
        { assignedTo: userId }
      ]
    })
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });

    console.log(`Found ${tasks.length} tasks for user ${userId} in ${workspaceNames.length} workspaces`);

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

    // Get all workspaces where user is a member or creator
    const userWorkspaces = await Workspace.find({
      $or: [{ createdBy: userId }, { members: userId }],
    });

    const workspaceNames = userWorkspaces.map((ws) => ws.name);

    // Get recent tasks from those workspaces OR assigned to this user
    const tasks = await Task.find({
      $or: [{ workspace: { $in: workspaceNames } }, { assignedTo: userId }],
    })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

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
    const { name, description, workspace, workspaceColor, priority, deadline, startDate, completed, category } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { name, description, workspace, workspaceColor, priority, deadline, startDate, completed, category },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("Task updated successfully:", task._id);

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task", error: error.message });
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
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
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
