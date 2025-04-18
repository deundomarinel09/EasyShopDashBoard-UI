import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Menu, Search, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

type HeaderProps = {
  setSidebarOpen: (open: boolean) => void;
};

const Header = ({ setSidebarOpen }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const notifications = [
    { id: 1, message: "New order received", time: "5 minutes ago" },
    { id: 2, message: "Product almost out of stock", time: "1 hour ago" },
    { id: 3, message: "Weekly report available", time: "Yesterday" },
  ];

  return (
    <header className="z-30 py-4 bg-white shadow-sm">
      <div className="container flex items-center justify-between h-full px-6 mx-auto">
        {/* Mobile menu button */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setSidebarOpen(true)}
          aria-label="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Right aligned items */}
        <div className="ml-auto flex items-center space-x-6">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              title="Notifications"
              className="relative p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 w-72 mt-2 overflow-hidden bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 animate-fadeIn">
                <div className="py-2 px-4 bg-blue-600 text-white font-semibold">
                  <p>Notifications</p>
                </div>
                <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <a
                      key={notification.id}
                      href="#"
                      className="block px-4 py-3 hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <p className="text-sm text-gray-900">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </a>
                  ))}
                </div>
                <a
                  href="#"
                  className="block bg-gray-50 text-sm text-center text-blue-600 py-2 hover:bg-gray-100"
                >
                  View all notifications
                </a>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              title="User Account"
              className="flex items-center text-sm p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Account"
              aria-haspopup="true"
            >
              {user?.avatar ? (
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={user.avatar}
                  alt="User avatar"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 w-48 mt-2 py-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fadeIn">
                <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-100">
                  <div className="font-semibold">{user?.name}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {user?.email}
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
