const Notification = require("../models/Notification");

const getUserIdFromRequest = (req) => req.user?.userId || req.user?.id || req.user?._id;

const getNotifications = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    return res.status(200).json({ unreadCount, notifications });
  } catch (error) {
    console.error("getNotifications error:", error);
    return res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

const markAsRead = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("markAsRead error:", error);
    return res.status(500).json({ message: "Failed to update notification" });
  }
};

module.exports = {
  getNotifications,
  markAsRead
};