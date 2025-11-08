import User from "../model/userModel.js";

// Middleware to check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    // For member management, createdBy is the admin performing the action
    // For other operations, userId is the user performing the action
    const userId = req.body.createdBy || req.body.userId || req.query.userId;

    console.log("isAdmin middleware - checking userId:", userId);
    console.log("Request body:", req.body);
    console.log("Request query:", req.query);

    if (!userId) {
      return res.status(401).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user.email, "Role:", user.role);

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    console.log("Admin access granted");
    next();
  } catch (error) {
    console.error("Error in admin middleware:", error);
    res.status(500).json({ message: "Error checking permissions", error: error.message });
  }
};
