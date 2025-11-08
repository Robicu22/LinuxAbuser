import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Dashboard/components/Sidebar";
import styles from "./InboxPage.module.css";

export default function InboxPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [filterTab, setFilterTab] = useState("all"); // "all", "unread"

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError("Please log in to view notifications");
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      const response = await axios.get(`http://localhost:5000/api/notifications?userId=${user.id}`);
      
      console.log("Notifications fetched:", response.data);
      const notificationsData = response.data.notifications || response.data;
      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert("Please log in");
        return;
      }

      const user = JSON.parse(storedUser);
      await axios.patch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        userId: user.id
      });

      // Update local state
      setNotifications(
        notifications.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      alert(error.response?.data?.message || "Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert("Please log in");
        return;
      }

      const user = JSON.parse(storedUser);
      await axios.patch(`http://localhost:5000/api/notifications/mark-all-read`, {
        userId: user.id
      });

      // Update local state
      setNotifications(
        notifications.map((notif) => ({ ...notif, read: true }))
      );

      alert("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      alert(error.response?.data?.message || "Failed to mark all as read");
    }
  };

  const getFilteredNotifications = () => {
    if (filterTab === "unread") {
      return notifications.filter(notif => !notif.read);
    }
    return notifications;
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className={styles.pageWrapper}>
      <button
        className={styles.menuButton}
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Inbox</h1>
          {unreadCount > 0 && (
            <button className={styles.markAllButton} onClick={handleMarkAllAsRead}>
              Mark All as Read
            </button>
          )}
        </div>
        
        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          <button
            className={`${styles.filterTab} ${filterTab === "all" ? styles.activeTab : ""}`}
            onClick={() => setFilterTab("all")}
          >
            All ({notifications.length})
          </button>
          <button
            className={`${styles.filterTab} ${filterTab === "unread" ? styles.activeTab : ""}`}
            onClick={() => setFilterTab("unread")}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {loading ? (
          <p className={styles.loadingMessage}>Loading notifications...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : (
          <div className={styles.notificationList}>
            {filteredNotifications.length === 0 ? (
              <p className={styles.emptyMessage}>
                {filterTab === "unread" 
                  ? "No unread notifications" 
                  : "No notifications yet"}
              </p>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`${styles.notificationItem} ${!notification.read ? styles.unread : ""}`}
                >
                  <div className={styles.notificationContent}>
                    {!notification.read && (
                      <div className={styles.unreadIndicator}>
                        <span className={styles.exclamationMark}>!</span>
                      </div>
                    )}
                    <div className={styles.notificationBody}>
                      <p className={styles.notificationMessage}>{notification.message}</p>
                      {notification.taskId && (
                        <div className={styles.taskInfo}>
                          {notification.taskId.category && (
                            <span className={styles.badge}>{notification.taskId.category}</span>
                          )}
                          {notification.taskId.workspace && (
                            <span className={styles.workspaceBadge}>{notification.taskId.workspace}</span>
                          )}
                        </div>
                      )}
                      <p className={styles.timestamp}>{formatDate(notification.createdAt)}</p>
                    </div>
                  </div>
                  {!notification.read && (
                    <button
                      className={styles.markReadButton}
                      onClick={() => handleMarkAsRead(notification._id)}
                      aria-label="Mark as read"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
