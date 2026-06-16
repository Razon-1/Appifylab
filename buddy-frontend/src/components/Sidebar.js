import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Sidebar({ darkMode }) {
  const location = useLocation();

  const menuItems = [
    { icon: '🏠', label: 'Home', href: '/feed' },
    { icon: '👥', label: 'Friends', href: '/friends' },
    { icon: '🔍', label: 'Explore', href: '/explore' },
    { icon: '💬', label: 'Messages', href: '/messages' },
    { icon: '⚙️', label: 'Settings', href: '/settings' },
  ];

  return (
    <aside className={`hidden md:block w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r pt-20`}>
      <nav className="p-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === item.href
                ? `bg-blue-600 text-white`
                : `hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
