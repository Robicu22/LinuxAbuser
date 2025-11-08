import Workspace from "../model/workspaceModel.js";
import User from "../model/userModel.js";

// Create a new workspace
export const createWorkspace = async (req, res) => {
  try {
    const { name, color, createdBy } = req.body;

    if (!name || !createdBy) {
      return res.status(400).json({ message: "Name and createdBy are required" });
    }

    const newWorkspace = new Workspace({
      name,
      color: color || "#3b82f6",
      createdBy,
      members: [], // Admin is not added as a member
    });

    await newWorkspace.save();
    res.status(201).json(newWorkspace);
  } catch (error) {
    console.error("Error creating workspace:", error);
    res.status(500).json({ message: "Error creating workspace", error });
  }
};

// Get all workspaces for a user (where user is creator or member)
export const getWorkspaces = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Check if user is admin
    const user = await User.findById(userId);
    
    let workspaces;
    if (user && user.role === "admin") {
      // Admin sees all workspaces
      workspaces = await Workspace.find({}).populate("createdBy", "name email");
    } else {
      // Regular users only see workspaces they're members of
      workspaces = await Workspace.find({
        members: userId,
      }).populate("createdBy", "name email");
    }

    res.status(200).json(workspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    res.status(500).json({ message: "Error fetching workspaces", error });
  }
};

// Get workspace by ID
export const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json(workspace);
  } catch (error) {
    console.error("Error fetching workspace:", error);
    res.status(500).json({ message: "Error fetching workspace", error });
  }
};

// Update workspace
export const updateWorkspace = async (req, res) => {
  try {
    const { name, color } = req.body;

    const workspace = await Workspace.findByIdAndUpdate(
      req.params.id,
      { name, color },
      { new: true }
    );

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json(workspace);
  } catch (error) {
    console.error("Error updating workspace:", error);
    res.status(500).json({ message: "Error updating workspace", error });
  }
};

// Delete workspace
export const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findByIdAndDelete(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.error("Error deleting workspace:", error);
    res.status(500).json({ message: "Error deleting workspace", error });
  }
};

// Add member to workspace
export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if user is already a member
    if (workspace.members.includes(userId)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    workspace.members.push(userId);
    await workspace.save();

    res.status(200).json(workspace);
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Error adding member", error });
  }
};

// Remove member from workspace
export const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    workspace.members = workspace.members.filter(
      (member) => member.toString() !== userId
    );

    await workspace.save();

    res.status(200).json(workspace);
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ message: "Error removing member", error });
  }
};
