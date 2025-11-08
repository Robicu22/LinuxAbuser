import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    default: "#3b82f6",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
