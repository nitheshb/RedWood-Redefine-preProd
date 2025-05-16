import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';

const NotificationHomeDropdown = ({  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifications = [
      {
        id: 1,
        title: 'New Lead',
        message: 'New lead is assigned',
        time: '5 minutes ago',
        read: false,
      },
      {
        id: 1,
        title: 'Site Visit Scheduled',
        message: 'A site visit has been scheduled for tomorrow at 10 AM',
        time: '5 minutes ago',
        read: false,
      },
      {
        id: 1,
        title: 'Upcoming Call',
        message: 'Follow up with chaitanya is pending',
        time: '5 minutes ago',
        read: false,
      },
      // Add more notifications...
    ];
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        aria-label="Notifications"
      >
        <Bell size={20} />

        {/* Notification badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-gray-200">
          <div className="py-2 px-3 bg-gray-100 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-1 text-xs font-medium text-red-500 bg-red-100 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start">
                      {/* Avatar or icon */}
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={notification.avatar}
                            alt=""
                          />
                        ) : (
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-gray-600">
                            {notification.icon || <Bell size={16} />}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                No notifications yet
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="py-2 px-4 text-center border-t border-gray-100 bg-gray-50">
              <button
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                onClick={() => console.log('Mark all as read')}
              >
                Mark all as read
              </button>
              <span className="mx-2 text-gray-300">•</span>
              <button
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                onClick={() => console.log('View all notifications')}
              >
                View all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationHomeDropdown;

// Example Usage:
const App = () => {
  // Example notification data
  const notificationData = [
    {
      id: 1,
      title: 'New Message',
      message: 'You received a new message from Sarah Johnson',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      title: 'Project Update',
      message: 'Your project "Website Redesign" has been approved',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      title: 'Friend Request',
      message: 'Michael Brown sent you a friend request',
      time: '3 hours ago',
      read: true,
    },
    {
      id: 4,
      title: 'Reminder',
      message: 'Meeting with design team at 2:00 PM today',
      time: 'Yesterday',
      read: true,
    },
  ];

  return (
    <div className="flex justify-end p-4 bg-gray-100">
      <NotificationHomeDropdown notifications={notificationData} />
    </div>
  );
};