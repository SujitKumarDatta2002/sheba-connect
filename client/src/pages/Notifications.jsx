import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaBell,
  FaClock,
  FaCalendarAlt,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle
} from 'react-icons/fa';

export default function Notifications() {
  const [loading, setLoading] = useState(false);
  const [reminders, setReminders] = useState([]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setReminders([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/service-applications/reminders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReminders(res.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [reminders]);

  const groupedNotifications = useMemo(() => {
    const groups = sortedReminders.reduce((acc, item) => {
      if (!acc[item.applicationId]) {
        acc[item.applicationId] = {
          applicationId: item.applicationId,
          serviceName: item.serviceName,
          notifications: []
        };
      }

      acc[item.applicationId].notifications.push(item);
      return acc;
    }, {});

    return Object.values(groups).sort((a, b) => {
      const aLatest = a.notifications[0]?.arrivedAt || a.notifications[0]?.date;
      const bLatest = b.notifications[0]?.arrivedAt || b.notifications[0]?.date;
      return new Date(bLatest) - new Date(aLatest);
    });
  }, [sortedReminders]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationMeta = (item) => {
    if (item.type === 'statusChange') {
      if (item.status === 'approved') {
        return {
          Icon: FaCheckCircle,
          iconClass: 'text-green-600 bg-green-100',
          label: 'Status Update'
        };
      }

      if (item.status === 'rejected') {
        return {
          Icon: FaTimesCircle,
          iconClass: 'text-red-600 bg-red-100',
          label: 'Status Update'
        };
      }

      return {
        Icon: FaInfoCircle,
        iconClass: 'text-blue-600 bg-blue-100',
        label: 'Status Update'
      };
    }

    if (item.type === 'documentSubmission') {
      return {
        Icon: FaFileAlt,
        iconClass: 'text-amber-700 bg-amber-100',
        label: 'Document Reminder'
      };
    }

    if (item.type === 'appointment') {
      return {
        Icon: FaCalendarAlt,
        iconClass: 'text-indigo-700 bg-indigo-100',
        label: 'Appointment Reminder'
      };
    }

    return {
      Icon: FaClock,
      iconClass: 'text-sky-700 bg-sky-100',
      label: 'Deadline Reminder'
    };
  };

  const getCountdownStyle = (daysLeft) => {
    if (daysLeft < 0) return 'bg-red-100 text-red-700';
    if (daysLeft === 0) return 'bg-amber-100 text-amber-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 bg-gradient-to-r from-indigo-700 to-blue-800 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center gap-3">
            <FaBell className="text-2xl" />
            <div>
              <h1 className="text-4xl font-bold mb-1">Notifications</h1>
              <p className="text-blue-100">Application deadline, document date, and appointment reminders</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">Loading notifications...</div>
        ) : groupedNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">No notifications available.</div>
        ) : (
          <div className="space-y-4">
            {groupedNotifications.map((group) => {
              const latestNotificationDate = group.notifications[0]?.arrivedAt || group.notifications[0]?.date;

              return (
              <div key={group.applicationId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{group.serviceName}</p>
                    <p className="text-xs text-gray-500 mt-1">Latest notification came on: {formatDate(latestNotificationDate)}</p>
                  </div>
                  <Link
                    to={`/application-status?applicationId=${group.applicationId}`}
                    className="text-sm font-medium text-blue-700 hover:text-blue-900 underline"
                  >
                    View this application
                  </Link>
                </div>

                <div className="space-y-3">
                  {group.notifications.map((item) => {
                    const { Icon, iconClass, label } = getNotificationMeta(item);

                    return (
                  <div key={`${item.applicationId}-${item.type}-${item.date}`} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 h-9 w-9 rounded-full inline-flex items-center justify-center ${iconClass}`}>
                          <Icon className="text-base" />
                        </span>
                        <div>
                          <p className="font-semibold text-gray-800">{label}</p>
                          <p className="text-sm text-gray-600 mt-1">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-1">Notification came on: {formatDate(item.arrivedAt || item.date)}</p>
                          <p className="text-xs text-gray-500">Event date: {formatDate(item.date)}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${getCountdownStyle(item.daysLeft)}`}>
                        <FaClock />
                        {item.daysLeft < 0
                          ? `${Math.abs(item.daysLeft)} day(s) overdue`
                          : item.daysLeft === 0
                            ? 'Today'
                            : `${item.daysLeft} day(s) left`}
                      </span>
                    </div>
                  </div>
                );
                  })}
                </div>

                <Link
                  to={`/application-status?applicationId=${group.applicationId}`}
                  className="inline-block mt-3 text-sm font-medium text-blue-700 hover:text-blue-900 underline"
                >
                  Press here to view schedule and submit requested documents
                </Link>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}
