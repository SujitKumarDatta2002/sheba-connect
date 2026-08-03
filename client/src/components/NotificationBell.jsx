import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../config/api";

export default function NotificationBell() {
        const [isOpen, setIsOpen] = useState(false);
        const [notifications, setNotifications] = useState([]);
        const [unreadCount, setUnreadCount] = useState(0);
        const dropdownRef = useRef(null);
        const navigate = useNavigate();

        const getHeaders = () => {
                const token = localStorage.getItem("token");
                if (!token) {
                        return null;
                }
                return { Authorization: `Bearer ${token}` };
        };

        const fetchNotifications = async () => {
                const headers = getHeaders();
                if (!headers) {
                        return;
                }

                try {
                        const res = await axios.get(`${API}/api/notifications`, { headers });
                        setNotifications(res.data.notifications || []);
                        setUnreadCount(res.data.unreadCount || 0);
                } catch (error) {
                        console.error("Failed to fetch notifications:", error);
                }
        };

        useEffect(() => {
                fetchNotifications();
        }, []);

        useEffect(() => {
                const onClickOutside = (event) => {
                        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                                setIsOpen(false);
                        }
                };

                document.addEventListener("mousedown", onClickOutside);
                return () => document.removeEventListener("mousedown", onClickOutside);
        }, []);

        const handleNotificationClick = async (notification) => {
                if (!notification.isRead) {
                        const headers = getHeaders();
                        if (headers) {
                                try {
                                        await axios.patch(
                                                `${API}/api/notifications/${notification._id}/read`,
                                                {},
                                                { headers }
                                        );

                                        setNotifications((prev) =>
                                                prev.map((item) =>
                                                        item._id === notification._id ? { ...item, isRead: true } : item
                                                )
                                        );
                                        setUnreadCount((prev) => Math.max(prev - 1, 0));
                                } catch (error) {
                                        console.error("Failed to mark notification as read:", error);
                                }
                        }
                }

                setIsOpen(false);

                // Redirect to the dashboard to show action-required applications/deadlines
                if (notification.category === "DOCUMENT" || notification.category === "APPLICATION" || notification.category === "DEADLINE") {
                        navigate("/dashboard");
                } else {
                        navigate("/");
                }
        };

        return (
                <div className="relative" ref={dropdownRef}>
                        <button
                                type="button"
                                onClick={() => setIsOpen((prev) => !prev)}
                                className="relative p-2 hover:bg-blue-800 rounded-full"
                                aria-label="Notifications"
                        >
                                <FaBell className="text-xl" />
                                {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                                {unreadCount > 99 ? "99+" : unreadCount}
                                        </span>
                                )}
                        </button>

                        {isOpen && (
                                <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-lg shadow-xl z-50 border border-gray-100">
                                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                                <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                                                {unreadCount > 0 && (
                                                        <span className="text-xs text-red-500 font-medium">{unreadCount} unread</span>
                                                )}
                                        </div>

                                        <div className="max-h-96 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                        <p className="px-4 py-6 text-sm text-gray-500 text-center">No notifications yet.</p>
                                                ) : (
                                                        notifications.map((notification) => (
                                                                <button
                                                                        key={notification._id}
                                                                        type="button"
                                                                        onClick={() => handleNotificationClick(notification)}
                                                                        className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                                                                               notification.isRead ? "bg-white" : "bg-blue-50"
                                                                        }`}
                                                                >
                                                                        <p className="text-sm font-semibold text-gray-800">{notification.title}</p>
                                                                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                                        <p className="text-xs text-gray-400 mt-2">
                                                                               {new Date(notification.createdAt).toLocaleString()}
                                                                        </p>
                                                                </button>
                                                        ))
                                                )}
                                        </div>
                                </div>
                        )}
                </div>
        );
}
