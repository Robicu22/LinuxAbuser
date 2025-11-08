import Notification from "../model/notificationModel.js";
import User from "../model/userModel.js";

// Get all notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const notifications = await Notification.find({ userId })
      .populate("taskId", "name category workspace deadline")
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 notifications

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const count = await Notification.countDocuments({ userId, read: false });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ message: "Error fetching unread count", error: error.message });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId }, // Ensure user owns this notification
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Error marking notification as read", error: error.message });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );

    res.status(200).json({ 
      message: "All notifications marked as read", 
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Error marking all notifications as read", error: error.message });
  }
};

// Create a notification (helper function)
export const createNotification = async (userId, message, taskId = null, type = "general") => {
  try {
    const notification = new Notification({
      userId,
      message,
      taskId,
      type,
      read: false,
    });

    await notification.save();
    console.log("Notification created for user:", userId);
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Delete old read notifications (cleanup - can be called periodically)
export const deleteOldNotifications = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await Notification.deleteMany({
      read: true,
      createdAt: { $lt: thirtyDaysAgo }
    });

    res.status(200).json({ 
      message: "Old notifications deleted", 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error("Error deleting old notifications:", error);
    res.status(500).json({ message: "Error deleting old notifications", error: error.message });
  }
};
