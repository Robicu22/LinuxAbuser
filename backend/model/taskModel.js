import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  workspace: {
    type: String,
    default: "",
  },
  workspaceColor: {
    type: String,
    default: "#3b82f6",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  deadline: {
    type: Date,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    default: "",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
}, {
  timestamps: true,
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
