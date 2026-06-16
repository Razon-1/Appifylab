/**
 * SIDEBAR COMPONENT
 * =================
 * Navigation sidebar for desktop view with menu items
 * 
 * FEATURES:
 * - Navigation menu with emoji icons
 * - Active page highlighting (blue background)
 * - Dark mode support
 * - Responsive (hidden on mobile, shown on md+ screens)
 * - Uses React Router for navigation
 * 
 * MENU ITEMS:
 * - 🏠 Home: Main feed
 * - 👥 Friends: Friend management
 * - 🔍 Explore: Discover content/users
 * - 💬 Messages: Direct messaging
 * - ⚙️ Settings: User settings
 * 
 * PROPS:
 * - darkMode: Boolean for dark theme
 * 
 * RESPONSIVE:
 * - Hidden on small/medium screens (hidden md:block)
 * - Fixed width of 256px (w-64)
 * - Sits to left of main content
 * - Sticks to top (pt-20 for header spacing)
 * 
 * STYLING:
 * - Tailwind CSS for all styles
 * - Supports light and dark modes
 * - Hover effects on menu items
 * - Active state with blue highlight
 */

import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Sidebar({ darkMode }) {
  // Get current location for active link highlighting
  const location = useLocation();

  // Menu items with icon, label, and route
  const menuItems = [
    { icon: '🏠', label: 'Home', href: '/feed' },
    { icon: '👥', label: 'Friends', href: '/friends' },
    { icon: '🔍', label: 'Explore', href: '/explore' },
    { icon: '💬', label: 'Messages', href: '/messages' },
    { icon: '⚙️', label: 'Settings', href: '/settings' },
  ];

  return (
    // Sidebar Container - Hidden on mobile, shown on md+ screens
    <aside className={`hidden md:block w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r pt-20`}>
      {/* Navigation Menu */}
      <nav className="p-6 space-y-2">
        {/* Map each menu item to a link */}
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            // Highlight active menu item
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === item.href
                ? `bg-blue-600 text-white`
                : `hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`
            }`}
          >
            {/* Menu Item Icon */}
            <span className="text-xl">{item.icon}</span>
            {/* Menu Item Label */}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
