import User from "../model/userModel.js";

// Middleware to check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.body.userId || req.body.createdBy || req.query.userId;

    if (!userId) {
      return res.status(401).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    next();
  } catch (error) {
    console.error("Error in admin middleware:", error);
    res.status(500).json({ message: "Error checking permissions", error: error.message });
  }
};
