import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const NotificationBell = () => {
  const { user, isFarmer } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isFarmer) {
      loadNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isFarmer]);

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications/farmer', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(data.data.notifications || []);
          setUnreadCount(data.data.notifications?.filter(n => !n.isRead).length || 0);
        }
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'product_approved':
        return '✅';
      case 'product_rejected':
        return '❌';
      case 'order_update':
        return '📦';
      default:
        return '📢';
    }
  };

  if (!isFarmer) return null;

  return (
    <div className="position-relative">
      <button
        className="btn btn-outline-primary position-relative"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <i className="bi bi-bell"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="position-absolute top-100 end-0 mt-2 bg-white border rounded shadow-lg" style={{ width: '350px', zIndex: 1000 }}>
          <div className="p-3 border-bottom">
            <h6 className="mb-0">Notifications</h6>
          </div>
          
          <div className="max-height-300 overflow-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-3 border-bottom ${!notification.isRead ? 'bg-light' : ''}`}
                  onClick={() => markAsRead(notification._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-start">
                    <div className="me-2 fs-5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{notification.title}</h6>
                      <p className="mb-1 small text-muted">{notification.message}</p>
                      <small className="text-muted">{formatTime(notification.createdAt)}</small>
                    </div>
                    {!notification.isRead && (
                      <div className="ms-2">
                        <span className="badge bg-primary rounded-pill">New</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted">
                <i className="bi bi-bell-slash fs-1 mb-3"></i>
                <p className="mb-0">No notifications yet</p>
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 border-top">
              <button
                className="btn btn-sm btn-outline-secondary w-100"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 