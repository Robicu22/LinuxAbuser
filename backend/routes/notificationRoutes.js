import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteOldNotifications,
} from "../controller/notificationController.js";

const router = express.Router();

// Notification routes
router.get("/notifications", getNotifications);
router.get("/notifications/unread-count", getUnreadCount);
router.patch("/notifications/:notificationId/read", markAsRead);
router.patch("/notifications/mark-all-read", markAllAsRead);
router.delete("/notifications/cleanup", deleteOldNotifications);

export default router;
